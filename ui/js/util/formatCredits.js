export function formatCredits(amount, precision) {
  if (amount == undefined) return 0;
  return amount.toFixed(precision || 1).replace(/\.?0+$/, "");
}

export function formatFullPrice(amount, precision) {
  let formated = "";

  const quantity = amount.toString().split(".");
  const fraction = quantity[1];

  if (fraction) {
    // Set precision
    precision = precision || 1;

    const decimals = fraction.split("");
    const first = decimals.filter(number => number != "0")[0];
    const index = decimals.indexOf(first);

    // Set format fraction
    formated = "." + fraction.substring(0, index + precision);
  }

  return parseFloat(quantity[0] + formated);
}
