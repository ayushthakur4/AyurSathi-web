import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { isValidAyurResponse } from "../utils/validateResponse.js";

const SYSTEM_INSTRUCTION =
  "You are an Ayurveda and yoga assistant. For the given health condition, return 4 simple home remedies and 4 yoga asanas or pranayama. Keep language simple and practical. Always include cautions. If the query is an emergency or serious condition (chest pain, breathing trouble, pregnancy, infants, severe bleeding, etc.), set 'emergency' to true and advise seeing a doctor immediately. If the query is not a health condition, return an empty remedies and yoga list. Never claim to cure diseases.";

/**
 * Structured JSON response schema enforced on Gemini output.
 */
const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    condition: {
      type: SchemaType.STRING,
      description: "Normalized name of the searched health condition.",
    },
    summary: {
      type: SchemaType.STRING,
      description: "A concise one or two line overview of the condition and gentle care.",
    },
    emergency: {
      type: SchemaType.BOOLEAN,
      description:
        "True if the query describes an emergency or serious condition requiring immediate medical care.",
    },
    remedies: {
      type: SchemaType.ARRAY,
      description: "List of 4 simple Ayurvedic home remedies, or empty if not a health condition.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          ingredients: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          steps: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          duration: { type: SchemaType.STRING },
          caution: { type: SchemaType.STRING },
          youtubeQuery: {
            type: SchemaType.STRING,
            description: "A short YouTube search phrase (never a URL).",
          },
        },
        required: ["name", "ingredients", "steps", "duration", "caution", "youtubeQuery"],
      },
    },
    yoga: {
      type: SchemaType.ARRAY,
      description: "List of 4 yoga asanas or pranayama, or empty if not a health condition.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          benefit: { type: SchemaType.STRING },
          steps: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          duration: { type: SchemaType.STRING },
          caution: { type: SchemaType.STRING },
          youtubeQuery: {
            type: SchemaType.STRING,
            description: "A short YouTube search phrase (never a URL).",
          },
        },
        required: ["name", "benefit", "steps", "duration", "caution", "youtubeQuery"],
      },
    },
    seeDoctorIf: {
      type: SchemaType.STRING,
      description: "Clear guidance on warning signs when the user should consult a doctor.",
    },
  },
  required: ["condition", "summary", "emergency", "remedies", "yoga", "seeDoctorIf"],
};

/**
 * Custom error class for service-level errors with HTTP status codes.
 */
export class GeminiServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "GeminiServiceError";
    this.statusCode = statusCode;
  }
}

const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
  "gemini-2.5-flash",
];

const RETRY_DELAYS_MS = [800, 1600];

/**
 * Build an ordered, deduplicated list of Gemini models to try.
 * Starts with GEMINI_MODEL (if configured) and falls back to alternative flash/lite models
 * if the primary model hits free-tier quota (429), deprecation (404), or server spikes (503).
 * @returns {string[]}
 */
function getModelCandidates() {
  const configured = process.env.GEMINI_MODEL?.trim();
  const candidates = configured
    ? [configured, ...FALLBACK_MODELS]
    : [DEFAULT_MODEL, ...FALLBACK_MODELS];
  return [...new Set(candidates.filter(Boolean))];
}

/**
 * Determine whether a Gemini SDK error is a quota/rate-limit error (HTTP 429).
 * We never immediately retry 429 errors on the same model so we don't burn Free Tier quota.
 * @param {unknown} err
 * @returns {boolean}
 */
function isQuotaError(err) {
  if (err?.status === 429) return true;
  const msg = err?.message || "";
  return /\[429\b|quota exceeded|rate[- ]limit/i.test(msg);
}

/**
 * Extract retry delay seconds from a Gemini 429 message when provided.
 * @param {unknown} err
 * @returns {number | null}
 */
function extractRetrySeconds(err) {
  const msg = err?.message || "";
  const match = msg.match(/retry in\s+([\d.]+)s/i);
  return match ? Math.ceil(Number(match[1])) : null;
}

/**
 * Determine whether a Gemini SDK error is a transient upstream server spike
 * (HTTP 503 high demand or 500 internal error).
 * @param {unknown} err
 * @returns {boolean}
 */
function isTransientServerError(err) {
  const status = err?.status;
  if (status === 503 || status === 500) {
    return true;
  }
  const msg = err?.message || "";
  return /\[(503|500)\b|high demand|overloaded|unavailable/i.test(msg);
}

/**
 * Determine whether an error justifies switching to the next fallback model.
 * @param {unknown} err
 * @returns {boolean}
 */
function shouldFallbackToNextModel(err) {
  if (isQuotaError(err) || isTransientServerError(err)) return true;
  if (err?.status === 404) return true;
  const msg = err?.message || "";
  return /\[404\b|no longer available|not found/i.test(msg);
}

/**
 * Sleep helper for retry backoff.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Attempt content generation against a single Gemini model, retrying transient 500/503 spikes.
 * @param {GoogleGenerativeAI} genAI
 * @param {string} modelName
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function generateWithRetry(genAI, modelName, prompt) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.4,
    },
  });

  let lastError;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const canRetry =
        attempt < RETRY_DELAYS_MS.length && isTransientServerError(err);
      if (canRetry) {
        const delayMs = RETRY_DELAYS_MS[attempt];
        console.warn(
          `Gemini transient error on ${modelName} (attempt ${attempt + 1}), retrying in ${delayMs}ms:`,
          err?.message || err
        );
        await sleep(delayMs);
        continue;
      }
      break;
    }
  }
  throw lastError;
}

/**
 * Query Google Gemini for Ayurvedic remedies and yoga recommendations.
 * Automatically falls back across flash/lite models when a model hits 429 free-tier quota
 * or transient 503/500 unavailability, and validates the structured JSON output.
 *
 * @param {string} query - Trimmed, validated user search query
 * @returns {Promise<object>} Validated JSON response object
 */
export async function fetchAyurGuidance(query) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new GeminiServiceError(
      "Server is missing a valid GEMINI_API_KEY configuration.",
      500
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = `Condition or query: "${query}". Provide practical Ayurvedic home remedies and yoga/pranayama guidance. Only include YouTube search phrases in youtubeQuery, never URLs.`;
  const candidates = getModelCandidates();

  let lastError = null;

  for (const modelName of candidates) {
    try {
      const rawText = await generateWithRetry(genAI, modelName, prompt);
      const parsed = JSON.parse(rawText);

      if (!isValidAyurResponse(parsed)) {
        console.warn(`Gemini model ${modelName} returned invalid schema, trying fallback if available.`);
        lastError = new GeminiServiceError(
          "Received an incomplete response format. Please try searching again.",
          502
        );
        continue;
      }

      return parsed;
    } catch (err) {
      lastError = err;
      console.warn(`Gemini call failed on ${modelName}:`, err?.message || err);

      if (err instanceof SyntaxError) {
        lastError = new GeminiServiceError(
          "Received an unreadable response from the guidance service. Please try again.",
          502
        );
        continue;
      }

      if (shouldFallbackToNextModel(err)) {
        continue;
      }
      break;
    }
  }

  console.error("All Gemini candidate models failed:", lastError?.message || lastError);
  if (lastError instanceof GeminiServiceError) {
    throw lastError;
  }
  if (isQuotaError(lastError)) {
    const retrySec = extractRetrySeconds(lastError);
    const waitText = retrySec ? `about ${retrySec} seconds` : "a moment";
    throw new GeminiServiceError(
      `AI rate limit reached on the free tier. Please wait ${waitText} and tap Retry.`,
      429
    );
  }
  if (isTransientServerError(lastError)) {
    throw new GeminiServiceError(
      "The AI service is temporarily experiencing high demand. Please tap Retry in a moment.",
      503
    );
  }
  throw new GeminiServiceError(
    "Unable to reach the guidance service right now. Please try again shortly.",
    502
  );
}
