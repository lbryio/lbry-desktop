// @flow
import { getFormatter } from './intlNumberFormat';

export function formatNumber(num: number, numberOfDigits?: number, short: boolean = false): string {
  const language = localStorage.getItem('language') || undefined;
  const safePrecision = Math.min(20, numberOfDigits || 0);
  const formatter = getFormatter(language, {
    maximumFractionDigits: safePrecision,
    notation: short ? 'compact' : 'standard',
    compactDisplay: 'short',
  });
  return formatter.format(num);
}

export function formatNumberWithCommas(num: number, numberOfDigits?: number): string {
  return num.toLocaleString('en', { minimumFractionDigits: numberOfDigits !== undefined ? numberOfDigits : 8 });
}

export function isTrulyANumber(num: number) {
  // typeof NaN = 'number' but NaN !== NaN
  return typeof num === 'number' && num === num; // eslint-disable-line
}
