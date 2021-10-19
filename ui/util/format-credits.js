function numberWithCommas(x) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function formatCredits(amount, precision, shortFormat = false) {
  let actualAmount = parseFloat(amount);
  let actualPrecision = parseFloat(precision);
  let suffix = '';

  if (Number.isNaN(actualAmount) || actualAmount === 0) return '0';

  if (actualAmount >= 1000000) {
    if (precision <= 7) {
      if (shortFormat) {
        actualAmount = actualAmount / 1000000;
        suffix = 'M';
      } else {
        actualPrecision -= 7;
      }
    }
  } else if (actualAmount >= 1000) {
    if (precision <= 4) {
      if (shortFormat) {
        actualAmount = actualAmount / 1000;
        suffix = 'K';
      } else {
        actualPrecision -= 4;
      }
    }
  }

  return (
    numberWithCommas(actualAmount.toFixed(actualPrecision >= 0 ? actualPrecision : 1).replace(/\.*0+$/, '')) + suffix
  );
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
