// these don't need to be exact
// Shapeshift does a more thorough check on validity
// just general matches to prevent unnecessary api calls
export const coinRegexPatterns = {
  BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  BCH: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  ETH: /^(0x)?[0-9a-fA-F]{40}$/,
  DASH: /^X([0-9a-zA-Z]){33}/,
  LTC: /^L[a-zA-Z0-9]{26,33}$/,
  XMR: /^4[0-9ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{94}$/,
};

const validateAddress = (coinType, address) => {
  if (!coinType || !address) return false;

  const coinRegex = coinRegexPatterns[coinType.toUpperCase()];
  if (!coinRegex) return false;

  return coinRegex.test(address);
};

export const validateShapeShiftForm = vals => {
  const errors = {};

  if (!vals.returnAddress) {
    return errors;
  }

  const isValidAddress = validateAddress(vals.originCoin, vals.returnAddress);

  if (!isValidAddress) {
    errors.returnAddress = `Enter a valid ${vals.originCoin} address`;
  }

  return errors;
};

const exampleCoinAddresses = {
  BTC: '1745oPaHeW7Fmpb1fUKTtasYfxr4zu9bwq',
  BCH: '1745oPaHeW7Fmpb1fUKTtasYfxr4zu9bwq',
  ETH: '0x8507cA6a274123fC8f80d929AF9D83602bC4e8cC',
  DASH: 'XedBP7vLPFXbS3URjrH2Z57Fg9SWftBmQ6',
  LTC: 'LgZivMvFMTDoqcA5weCQ2QrmRp7pa56bBk',
  XMR:
    '466XMeJEcowYGx7RzUJj3VDWBZgRWErVQQX6tHYbsacS5QF6v3tidE6LZZnTJgzeEh6bKEEJ6GC9jHirrUKvJwVKVj9e7jm',
};

export const getExampleAddress = coin => exampleCoinAddresses[coin];
