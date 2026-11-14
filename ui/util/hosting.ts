export function convertGbToMbStr(gb: unknown): string {
  return String(Number(gb) * 1024);
}

export function isValidHostingAmount(amountString: string): string | number | boolean {
  const numberAmount = Number(amountString);
  return amountString.length && ((numberAmount && String(numberAmount)) || numberAmount === 0);
}
