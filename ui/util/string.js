// @flow

export function toCapitalCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toCompactNotation(number: string | number, lang: ?string) {
  try {
    return Number(number).toLocaleString(lang || 'en', {
      compactDisplay: 'short',
      notation: 'compact',
    });
  } catch (err) {
    // Not all browsers support the addition options.
    return Number(number).toLocaleString();
  }
}
