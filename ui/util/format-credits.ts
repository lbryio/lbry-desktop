import { getFormatter } from "./intlNumberFormat";

export function formatCredits(amount: number | string, precision: number, shortFormat = false): string {
  const language = localStorage.getItem("language") || undefined;
  const actualAmount = Number(amount);
  const safePrecision = Math.min(20, Math.max(1, precision || 0));

  if (Number.isNaN(actualAmount) || actualAmount === 0) return "0";

  if (shortFormat) {
    const formatter = getFormatter(language, {
      minimumFractionDigits: safePrecision,
      maximumFractionDigits: safePrecision,
      roundingIncrement: 5,
      // Display suffix (M, K, etc.)
      notation: "compact",
      compactDisplay: "short",
    });
    return formatter.format(actualAmount);
  }

  const formatter = getFormatter(language, {
    minimumFractionDigits: safePrecision,
    maximumFractionDigits: safePrecision,
    roundingIncrement: 5,
  });
  return formatter.format(actualAmount);
}

export function formatFullPrice(amount: number | string, precision = 1): number {
  let formated = "";

  const quantity = amount.toString().split(".");
  const fraction = quantity[1];

  if (fraction) {
    const decimals = fraction.split("");
    const first = decimals.filter((number) => number !== "0")[0];
    const index = decimals.indexOf(first);

    // Set format fraction
    formated = `.${fraction.substring(0, index + precision)}`;
  }

  return parseFloat(quantity[0] + formated);
}

export function creditsToString(amount: number | string): string {
  const creditString = parseFloat(String(amount)).toFixed(8);
  return creditString;
}
