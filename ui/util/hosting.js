export function convertGbToMbStr(gb) {
  return String(Number(gb) * 1024);
}

export function isValidHostingAmount(amountString) {
  const numberAmount = Number(amountString);
  return amountString.length && ((numberAmount && String(numberAmount)) || numberAmount === 0);
}
