export const setDifference = <T>(setA: Iterable<T>, setB: Iterable<T>): Set<T> => {
  const _difference = new Set(setA);
  for (const el of setB) {
    _difference.delete(el);
  }
  return _difference;
};

export const setUnion = <T>(setA: Iterable<T>, setB: Iterable<T>): Set<T> => {
  const _union = new Set(setA);
  for (const el of setB) {
    _union.add(el);
  }
  return _union;
};
