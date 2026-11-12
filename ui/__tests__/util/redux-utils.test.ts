import { handleActions } from "util/redux-utils";

type S = { count: number; items: string[] };
const initial: S = { count: 0, items: [] };

const reducer = handleActions(
  {
    INC: (state: S) => ({ ...state, count: state.count + 1 }),
    NOOP: (state: S) => state,
    PARTIAL: () => ({ count: 9 }),
    NOTHING: () => undefined,
  },
  initial
);

describe("handleActions", () => {
  it("uses the default state when none is given", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toBe(initial);
  });

  it("returns the very same state for an action with no handler", () => {
    const state = { count: 3, items: [] };
    expect(reducer(state, { type: "UNKNOWN" })).toBe(state);
  });

  // #707: a handler that changed nothing must not produce a new top-level object, or every
  // connected component recomputes its props for an update that did nothing.
  it("returns the same state when the handler returns it unchanged", () => {
    const state = { count: 3, items: ["a"] };
    expect(reducer(state, { type: "NOOP" })).toBe(state);
  });

  it("returns a new object when the handler returns a changed copy", () => {
    const state = { count: 3, items: ["a"] };
    const next = reducer(state, { type: "INC" });
    expect(next).not.toBe(state);
    expect(next).toEqual({ count: 4, items: ["a"] });
    expect(state.count).toBe(3);
  });

  it("merges a partial result into the existing state", () => {
    const state = { count: 3, items: ["a"] };
    expect(reducer(state, { type: "PARTIAL" })).toEqual({ count: 9, items: ["a"] });
  });

  it("treats a handler that returns nothing as a copy of the state", () => {
    const state = { count: 3, items: ["a"] };
    const next = reducer(state, { type: "NOTHING" });
    expect(next).toEqual(state);
    expect(next).not.toBe(state);
  });
});
