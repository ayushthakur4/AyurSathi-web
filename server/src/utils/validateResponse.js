const MAX_QUERY_LENGTH = 100;

/**
 * Validate and sanitize the incoming search query.
 * Must be a non-empty string with at most 100 characters after trimming.
 *
 * @param {unknown} rawQuery
 * @returns {{ valid: true, query: string } | { valid: false, error: string }}
 */
export function validateSearchQuery(rawQuery) {
  if (typeof rawQuery !== "string") {
    return { valid: false, error: "Please provide a valid search query." };
  }

  const trimmed = rawQuery.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Search query cannot be empty." };
  }

  if (trimmed.length > MAX_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Search query must be ${MAX_QUERY_LENGTH} characters or fewer.`,
    };
  }

  return { valid: true, query: trimmed };
}

/**
 * Check that a value is an array of strings.
 * @param {unknown} value
 * @returns {boolean}
 */
function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * Validate a single remedy object against the required contract.
 * @param {unknown} item
 * @returns {boolean}
 */
function isValidRemedy(item) {
  if (!item || typeof item !== "object") return false;
  return (
    typeof item.name === "string" &&
    isStringArray(item.ingredients) &&
    isStringArray(item.steps) &&
    typeof item.duration === "string" &&
    typeof item.caution === "string" &&
    typeof item.youtubeQuery === "string"
  );
}

/**
 * Validate a single yoga object against the required contract.
 * @param {unknown} item
 * @returns {boolean}
 */
function isValidYoga(item) {
  if (!item || typeof item !== "object") return false;
  return (
    typeof item.name === "string" &&
    typeof item.benefit === "string" &&
    isStringArray(item.steps) &&
    typeof item.duration === "string" &&
    typeof item.caution === "string" &&
    typeof item.youtubeQuery === "string"
  );
}

/**
 * Validate the parsed JSON payload returned by Gemini.
 * Ensures all required top-level fields and item structures exist.
 *
 * @param {unknown} data
 * @returns {boolean}
 */
export function isValidAyurResponse(data) {
  if (!data || typeof data !== "object") return false;

  return (
    typeof data.condition === "string" &&
    typeof data.summary === "string" &&
    typeof data.emergency === "boolean" &&
    Array.isArray(data.remedies) &&
    data.remedies.every(isValidRemedy) &&
    Array.isArray(data.yoga) &&
    data.yoga.every(isValidYoga) &&
    typeof data.seeDoctorIf === "string"
  );
}
