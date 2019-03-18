export function swapKeyAndValue(dict) {
  const ret = {};
  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      ret[dict[key]] = key;
    }
  }
  return ret;
}
