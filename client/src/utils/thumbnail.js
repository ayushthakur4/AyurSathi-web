/**
 * Build a Bing Image thumbnail URL for an Ayurvedic remedy or yoga pose.
 * Uses Bing's public thumbnail endpoint with clean dimensions and smart cropping.
 *
 * @param {string} name - Remedy or yoga asana name
 * @param {"remedies" | "yoga"} type - Category type
 * @returns {string}
 */
export function getBingThumbnailUrl(name, type) {
  const cleaned = (name || "").trim();
  const suffix = type === "yoga" ? "yoga pose asana" : "ayurvedic herbal remedy";
  const query = cleaned ? `${cleaned} ${suffix}` : suffix;
  return `https://tse1.mm.bing.net/th?q=${encodeURIComponent(query)}&w=640&h=400&c=7&rs=1&p=0`;
}
