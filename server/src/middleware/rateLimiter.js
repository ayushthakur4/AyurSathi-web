import rateLimit from "express-rate-limit";

/**
 * Rate limiter for /api/search: limits each IP to 20 requests per minute
 * to protect Gemini API quota and prevent abuse.
 */
export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many searches from this IP. Please wait a minute and try again.",
  },
});
