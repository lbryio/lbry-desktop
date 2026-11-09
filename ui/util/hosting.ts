//@ts-nocheck
export function convertGbToMbStr(gb: unknown) {
  return String(Number(gb) * 1024);
}

export function isValidHostingAmount(amountString: unknown) {
  const numberAmount = Number(amountString);
  return amountString.length && ((numberAmount && String(numberAmount)) || numberAmount === 0);
}
