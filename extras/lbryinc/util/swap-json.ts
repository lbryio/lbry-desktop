//@ts-nocheck
export function swapKeyAndValue(dict: unknown) {
  const ret: Record<string, any> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      ret[dict[key]] = key;
    }
  }
  return ret;
}
