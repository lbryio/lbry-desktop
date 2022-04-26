export function formatCredits(amount, precision, shortFormat = false) {
  const actualAmount = Number(amount);
  const safePrecision = Math.min(20, Math.max(1, precision));

  if (Number.isNaN(actualAmount) || actualAmount === 0) return '0';

  if (shortFormat) {
    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: safePrecision,
      maximumFractionDigits: safePrecision,
      roundingIncrement: 5,
      // Display suffix (M, K, etc.)
      notation: 'compact',
      compactDisplay: 'short',
    });
    return formatter.format(actualAmount);
  }

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: safePrecision,
    maximumFractionDigits: safePrecision,
    roundingIncrement: 5,
  });
  return formatter.format(actualAmount);
}

export function formatFullPrice(amount, precision = 1) {
  let formated = '';

  const quantity = amount.toString().split('.');
  const fraction = quantity[1];

  if (fraction) {
    const decimals = fraction.split('');
    const first = decimals.filter((number) => number !== '0')[0];
    const index = decimals.indexOf(first);

    // Set format fraction
    formated = `.${fraction.substring(0, index + precision)}`;
  }

  return parseFloat(quantity[0] + formated);
}

export function creditsToString(amount) {
  const creditString = parseFloat(amount).toFixed(8);
  return creditString;
}
