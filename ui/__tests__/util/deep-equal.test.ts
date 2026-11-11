import isEqual from "../../util/deep-equal";

describe("isEqual", () => {
  it("compares primitives strictly", () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual("a", "a")).toBe(true);
    expect(isEqual(1, "1")).toBe(false);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(null, undefined)).toBe(false);
  });

  it("treats NaN as equal to NaN, and 0 as distinct from -0", () => {
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(0, -0)).toBe(false);
  });

  it("deep-compares arrays", () => {
    expect(isEqual([1, 2, [3]], [1, 2, [3]])).toBe(true);
    expect(isEqual([1, 2], [2, 1])).toBe(false);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it("deep-compares objects regardless of key order", () => {
    expect(isEqual({ a: 1, b: { c: 2 } }, { b: { c: 2 }, a: 1 })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false);
  });

  it("compares dates and regexes by value", () => {
    expect(isEqual(new Date(1000), new Date(1000))).toBe(true);
    expect(isEqual(new Date(1000), new Date(2000))).toBe(false);
    expect(isEqual(/abc/i, /abc/i)).toBe(true);
    expect(isEqual(/abc/i, /abc/g)).toBe(false);
  });
});
