import * as ACTIONS from "constants/action_types";
import reducer from "redux/reducers/tags";

const init = () => reducer(undefined, { type: "@@INIT" });
const withTags = (followedTags: string[], knownTags: Record<string, any> = {}) => ({
  ...init(),
  followedTags,
  knownTags,
});

describe("tags reducer", () => {
  it("starts following nothing, with the default tags known", () => {
    const state = init();
    expect(state.followedTags).toEqual([]);
    expect(Object.keys(state.knownTags).length).toBeGreaterThan(0);
    for (const tag of Object.keys(state.knownTags)) expect(state.knownTags[tag]).toEqual({ name: tag });
  });

  describe("TOGGLE_TAG_FOLLOW", () => {
    it("follows a tag that isn't followed", () => {
      const next = reducer(withTags(["a"]), { type: ACTIONS.TOGGLE_TAG_FOLLOW, data: { name: "b" } });
      expect(next.followedTags).toEqual(["a", "b"]);
    });

    it("unfollows a followed tag and leaves the others in order", () => {
      const next = reducer(withTags(["a", "b", "c"]), { type: ACTIONS.TOGGLE_TAG_FOLLOW, data: { name: "b" } });
      expect(next.followedTags).toEqual(["a", "c"]);
    });

    it("does not mutate the previous state", () => {
      const state = withTags(["a"]);
      reducer(state, { type: ACTIONS.TOGGLE_TAG_FOLLOW, data: { name: "b" } });
      expect(state.followedTags).toEqual(["a"]);
    });
  });

  it("TAG_ADD adds to knownTags without following it", () => {
    const next = reducer(withTags(["a"], { a: { name: "a" } }), { type: ACTIONS.TAG_ADD, data: { name: "z" } });
    expect(next.knownTags).toEqual({ a: { name: "a" }, z: { name: "z" } });
    expect(next.followedTags).toEqual(["a"]);
  });

  it("TAG_DELETE removes the tag from both known and followed", () => {
    const state = withTags(["a", "b"], { a: { name: "a" }, b: { name: "b" } });
    const next = reducer(state, { type: ACTIONS.TAG_DELETE, data: { name: "a" } });
    expect(next.knownTags).toEqual({ b: { name: "b" } });
    expect(next.followedTags).toEqual(["b"]);
    expect(state.knownTags.a).toBeDefined();
  });

  describe("SYNC_STATE_POPULATE", () => {
    const populate = (state: any, tags: any) => reducer(state, { type: ACTIONS.SYNC_STATE_POPULATE, data: { tags } });

    // handleActions keeps the same object when a handler returns its state unchanged (#707).
    it("returns the same state when the synced tags match", () => {
      const state = withTags(["a", "b"]);
      expect(populate(state, ["a", "b"])).toBe(state);
    });

    it("replaces followed tags and drops non-strings", () => {
      expect(populate(withTags(["a"]), ["x", 5, null, "y"]).followedTags).toEqual(["x", "y"]);
    });

    it("keeps followed tags when the sync has no tag list", () => {
      expect(populate(withTags(["a"]), null).followedTags).toEqual(["a"]);
      expect(populate(withTags(["a"]), undefined).followedTags).toEqual(["a"]);
    });
  });
});
