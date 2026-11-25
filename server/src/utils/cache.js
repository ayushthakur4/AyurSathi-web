/**
 * Simple in-memory Map cache keyed by normalized lowercase query.
 * Avoids duplicate Gemini API calls for repeated searches.
 */
const searchCache = new Map();
const MAX_CACHE_ENTRIES = 500;

/**
 * Retrieve a cached result for a lowercase query.
 * @param {string} key
 * @returns {object | undefined}
 */
export function getCachedResult(key) {
  return searchCache.get(key);
}

/**
 * Store a validated search result in memory with basic size eviction.
 * @param {string} key
 * @param {object} value
 */
export function setCachedResult(key, value) {
  if (searchCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = searchCache.keys().next().value;
    if (oldestKey !== undefined) {
      searchCache.delete(oldestKey);
    }
  }
  searchCache.set(key, value);
}
