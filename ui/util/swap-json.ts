export function swapKeyAndValue(dict: Record<string, string | number>): Record<string, string> {
  const ret: Record<string, string> = {};
  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      ret[dict[key]] = key;
    }
  }
  return ret;
}
