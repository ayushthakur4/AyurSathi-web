import express from "express";
import { searchRateLimiter } from "../middleware/rateLimiter.js";
import { getCachedResult, setCachedResult } from "../utils/cache.js";
import { validateSearchQuery } from "../utils/validateResponse.js";
import { fetchAyurGuidance, GeminiServiceError } from "../services/gemini.js";

const router = express.Router();

// Deduplicate simultaneous requests for the same query (prevents React StrictMode double-calls from burning Gemini quota)
const inFlightRequests = new Map();

/**
 * POST /api/search
 * Body: { "query": "back pain" }
 * Validates input, checks in-memory cache, deduplicates in-flight queries, and calls Gemini.
 */
router.post("/", searchRateLimiter, async (req, res) => {
  const validation = validateSearchQuery(req.body?.query);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { query } = validation;
  const cacheKey = query.toLowerCase();

  const cached = getCachedResult(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  try {
    let pending = inFlightRequests.get(cacheKey);
    if (!pending) {
      pending = fetchAyurGuidance(query)
        .then((guidance) => {
          setCachedResult(cacheKey, guidance);
          return guidance;
        })
        .finally(() => {
          inFlightRequests.delete(cacheKey);
        });
      inFlightRequests.set(cacheKey, pending);
    }

    const guidance = await pending;
    return res.status(200).json(guidance);
  } catch (err) {
    if (err instanceof GeminiServiceError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error("Unexpected error in /api/search:", err);
    return res.status(500).json({
      error: "An unexpected error occurred while generating guidance.",
    });
  }
});

export default router;
