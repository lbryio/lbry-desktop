//@ts-nocheck
export const setDifference = (setA: unknown, setB: unknown) => {
  const _difference = new Set(setA);
  for (const el of setB) {
    _difference.delete(el);
  }
  return _difference;
};

export const setUnion = (setA: unknown, setB: unknown) => {
  const _union = new Set(setA);
  for (const el of setB) {
    _union.add(el);
  }
  return _union;
};
