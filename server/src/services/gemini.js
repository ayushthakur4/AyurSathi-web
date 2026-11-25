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

const RETRY_DELAYS_MS = [1000, 2000];

/**
 * Determine whether a Gemini SDK error is a quota/rate-limit error (HTTP 429).
 * We never immediately retry 429 errors so we don't burn Free Tier quota.
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
 * Sleep helper for retry backoff.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Query Google Gemini for Ayurvedic remedies and yoga recommendations.
 * Retries transient 503/500 spikes with backoff, and surfaces 429 quota limits cleanly.
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

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.4,
    },
  });

  const prompt = `Condition or query: "${query}". Provide practical Ayurvedic home remedies and yoga/pranayama guidance. Only include YouTube search phrases in youtubeQuery, never URLs.`;

  let rawText;
  let lastError;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      rawText = result.response.text();
      lastError = null;
      break;
    } catch (err) {
      lastError = err;
      const canRetry =
        attempt < RETRY_DELAYS_MS.length && isTransientServerError(err);
      if (canRetry) {
        const delayMs = RETRY_DELAYS_MS[attempt];
        console.warn(
          `Gemini transient error (attempt ${attempt + 1}), retrying in ${delayMs}ms:`,
          err?.message || err
        );
        await sleep(delayMs);
        continue;
      }
      break;
    }
  }

  if (lastError) {
    console.error("Gemini API call failed:", lastError?.message || lastError);
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

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse Gemini JSON output:", err?.message || err);
    throw new GeminiServiceError(
      "Received an unreadable response from the guidance service. Please try again.",
      502
    );
  }

  if (!isValidAyurResponse(parsed)) {
    console.error("Gemini response failed schema validation:", parsed);
    throw new GeminiServiceError(
      "Received an incomplete response format. Please try searching again.",
      502
    );
  }

  return parsed;
}
