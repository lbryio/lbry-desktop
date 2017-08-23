/**
 * Thin wrapper around localStorage.getItem(). Parses JSON and returns undefined if the value
 * is not set yet.
 */
export function getLocal(key, fallback = undefined) {
  const itemRaw = localStorage.getItem(key);
  return itemRaw === null ? fallback : JSON.parse(itemRaw);
}

/**
 * Thin wrapper around localStorage.setItem(). Converts value to JSON.
 */
export function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Thin wrapper around localStorage.getItem(). Parses JSON and returns undefined if the value
 * is not set yet.
 */
export function getSession(key, fallback = undefined) {
  const itemRaw = sessionStorage.getItem(key);
  return itemRaw === null ? fallback : JSON.parse(itemRaw);
}

/**
 * Thin wrapper around localStorage.setItem(). Converts value to JSON.
 */
export function setSession(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function formatCredits(amount, precision) {
  return amount.toFixed(precision || 1).replace(/\.?0+$/, "");
}

export function formatFullPrice(amount, precision) {
  let formated = "";

  const quantity = amount.toString().split(".");
  const fraction = quantity[1];

  if (fraction) {
    // Set precision
    precision = precision || 1;

    const decimals = fraction.split("");
    const first = decimals.filter(number => number != "0")[0];
    const index = decimals.indexOf(first);

    // Set format fraction
    formated = "." + fraction.substring(0, index + precision);
  }

  return parseFloat(quantity[0] + formated);
}
