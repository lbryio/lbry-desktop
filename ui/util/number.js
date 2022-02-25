// @flow

export function formatNumberWithCommas(num: number, numberOfDigits?: number): string {
  return num.toLocaleString('en', { minimumFractionDigits: numberOfDigits !== undefined ? numberOfDigits : 8 });
}

export function isTrulyANumber(num: number) {
  // typeof NaN = 'number' but NaN !== NaN
  return typeof num === 'number' && num === num; // eslint-disable-line
}
