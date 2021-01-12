// @flow

export function formatNumberWithCommas(num: number, numberOfDigits?: number): string {
  return num.toLocaleString('en', { minimumFractionDigits: numberOfDigits !== undefined ? numberOfDigits : 8 });
}
