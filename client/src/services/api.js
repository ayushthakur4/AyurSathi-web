const DEFAULT_API_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://ayur-web.onrender.com";

const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(
  /\/+$/,
  ""
);

/**
 * Request Ayurvedic remedies and yoga guidance from the backend API.
 * Never holds or sends any Gemini API key on the client.
 *
 * @param {string} query - Health condition entered by the user
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<object>}
 */
export async function searchCondition(query, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    signal,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      (response.status === 429
        ? "Too many searches right now. Please wait a minute and try again."
        : "Something went wrong while fetching guidance. Please try again.");
    throw new Error(message);
  }

  return payload;
}
