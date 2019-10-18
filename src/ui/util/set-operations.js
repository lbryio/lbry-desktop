export const setDifference = (setA, setB) => {
  let _difference = new Set(setA);
  for (let el of setB) {
    _difference.delete(el);
  }
  return _difference;
};

export const setUnion = (setA, setB) => {
  let _union = new Set(setA);
  for (let el of setB) {
    _union.add(el);
  }
  return _union;
};
