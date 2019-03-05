export function swapKeyAndValue(dict) {
  const ret = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      ret[dict[key]] = key;
    }
  }
  return ret;
}
