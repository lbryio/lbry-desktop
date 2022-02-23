// @flow

export function toCapitalCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toCompactNotation(number: string | number, lang: ?string, minThresholdToApply?: string | number) {
  const locale = lang || 'en';

  if (minThresholdToApply && Number(number) >= Number(minThresholdToApply)) {
    try {
      return Number(number).toLocaleString(locale, {
        compactDisplay: 'short',
        notation: 'compact',
      });
    } catch (err) {
      // Not all browsers support the additional options.
      return Number(number).toLocaleString(locale);
    }
  } else {
    return Number(number).toLocaleString(locale);
  }
}

export function stripLeadingAtSign(str: ?string) {
  return str && str.charAt(0) === '@' ? str.slice(1) : str;
}
