/**
 * Thin wrapper around localStorage.getItem(). Parses JSON and returns undefined if the value
 * is not set yet.
 */
export function getLocal(key) {
  const itemRaw = localStorage.getItem(key);
  return itemRaw === null ? undefined : JSON.parse(itemRaw);
}

/**
 * Thin wrapper around localStorage.setItem(). Converts value to JSON.
 */
export function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}