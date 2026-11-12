import * as ACTIONS from "constants/action_types";
import reducer from "redux/reducers/content";

const init = () => reducer(undefined, { type: "@@INIT" });
const act = (state: any, type: string, data: any = {}) => reducer(state, { type, data });

describe("content reducer", () => {
  it("returns the same state for an unknown action", () => {
    const state = init();
    expect(reducer(state, { type: "NOPE" })).toBe(state);
  });

  it("SET_PLAYING_URI records the source and carries the primary uri along", () => {
    const state = act(init(), ACTIONS.SET_PRIMARY_URI, { uri: "lbry://primary" });
    const next = act(state, ACTIONS.SET_PLAYING_URI, {
      uri: "lbry://x",
      source: "queue",
      pathname: "/p",
      collectionId: "c",
    });
    expect(next.playingUri).toEqual({
      uri: "lbry://x",
      source: "queue",
      pathname: "/p",
      commentId: undefined,
      collectionId: "c",
      primaryUri: "lbry://primary",
    });
  });

  describe("positions", () => {
    it("SET_CONTENT_POSITION keeps other outpoints of the same claim", () => {
      let state = act(init(), ACTIONS.SET_CONTENT_POSITION, { claimId: "c1", outpoint: "o1", position: 10 });
      state = act(state, ACTIONS.SET_CONTENT_POSITION, { claimId: "c1", outpoint: "o2", position: 20 });
      expect(state.positions).toEqual({ c1: { o1: 10, o2: 20 } });
    });

    it("CLEAR_CONTENT_POSITION removes one outpoint when others remain", () => {
      const state = { ...init(), positions: { c1: { o1: 1, o2: 2 } } };
      expect(act(state, ACTIONS.CLEAR_CONTENT_POSITION, { claimId: "c1", outpoint: "o1" }).positions).toEqual({
        c1: { o2: 2 },
      });
    });

    it("CLEAR_CONTENT_POSITION removes the claim entirely when its last outpoint goes", () => {
      const state = { ...init(), positions: { c1: { o1: 1 }, c2: { o9: 9 } } };
      expect(act(state, ACTIONS.CLEAR_CONTENT_POSITION, { claimId: "c1", outpoint: "o1" }).positions).toEqual({
        c2: { o9: 9 },
      });
    });

    it("CLEAR_CONTENT_POSITION returns the same state for an unknown claim", () => {
      const state = init();
      expect(act(state, ACTIONS.CLEAR_CONTENT_POSITION, { claimId: "none", outpoint: "o" })).toBe(state);
    });

    it("CLEAR_CONTENT_CACHE empties all positions", () => {
      const state = { ...init(), positions: { c1: { o1: 1 } } };
      expect(act(state, ACTIONS.CLEAR_CONTENT_CACHE).positions).toEqual({});
    });
  });

  describe("history", () => {
    const viewed = (state: any, uri: string, lastViewed: number) =>
      act(state, ACTIONS.SET_CONTENT_LAST_VIEWED, { uri, lastViewed });

    it("puts the most recently viewed uri first", () => {
      let state = viewed(init(), "a", 1);
      state = viewed(state, "b", 2);
      expect(state.history.map((h: any) => h.uri)).toEqual(["b", "a"]);
    });

    it("moves a re-viewed uri to the front without duplicating it", () => {
      let state = viewed(viewed(viewed(init(), "a", 1), "b", 2), "c", 3);
      state = viewed(state, "a", 4);
      expect(state.history).toEqual([
        { uri: "a", lastViewed: 4 },
        { uri: "c", lastViewed: 3 },
        { uri: "b", lastViewed: 2 },
      ]);
    });

    it("CLEAR_CONTENT_HISTORY_URI removes one entry, or returns the same state if absent", () => {
      const state = viewed(viewed(init(), "a", 1), "b", 2);
      expect(act(state, ACTIONS.CLEAR_CONTENT_HISTORY_URI, { uri: "a" }).history.map((h: any) => h.uri)).toEqual(["b"]);
      expect(act(state, ACTIONS.CLEAR_CONTENT_HISTORY_URI, { uri: "zzz" })).toBe(state);
    });

    it("CLEAR_CONTENT_HISTORY_ALL empties it", () => {
      expect(act(viewed(init(), "a", 1), ACTIONS.CLEAR_CONTENT_HISTORY_ALL).history).toEqual([]);
    });
  });
});
