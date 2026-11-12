import * as ACTIONS from "constants/action_types";
import reducer from "redux/reducers/blocked";

describe("blocked reducer", () => {
  const init = () => reducer(undefined, { type: "@@INIT" });
  const toggle = (state: any, uri: string) => reducer(state, { type: ACTIONS.TOGGLE_BLOCK_CHANNEL, data: { uri } });

  it("starts empty", () => {
    expect(init()).toEqual({ blockedChannels: [] });
  });

  it("blocks a channel at the front of the list", () => {
    expect(toggle({ blockedChannels: ["lbry://@a"] }, "lbry://@b").blockedChannels).toEqual(["lbry://@b", "lbry://@a"]);
  });

  it("unblocks a channel that is blocked", () => {
    expect(toggle({ blockedChannels: ["lbry://@b", "lbry://@a"] }, "lbry://@b").blockedChannels).toEqual(["lbry://@a"]);
  });

  it("does not mutate the previous list", () => {
    const state = { blockedChannels: ["lbry://@a"] };
    toggle(state, "lbry://@b");
    expect(state.blockedChannels).toEqual(["lbry://@a"]);
  });

  describe("SYNC_STATE_POPULATE", () => {
    const populate = (state: any, blocked: any) =>
      reducer(state, { type: ACTIONS.SYNC_STATE_POPULATE, data: { blocked } });

    it("replaces the list and drops non-strings", () => {
      expect(populate({ blockedChannels: ["old"] }, ["a", 1, null, "b"]).blockedChannels).toEqual(["a", "b"]);
    });

    it("keeps the list when sync has none", () => {
      expect(populate({ blockedChannels: ["old"] }, null).blockedChannels).toEqual(["old"]);
      expect(populate({ blockedChannels: ["old"] }, undefined).blockedChannels).toEqual(["old"]);
    });

    it("lets sync clear the list with an empty array", () => {
      expect(populate({ blockedChannels: ["old"] }, []).blockedChannels).toEqual([]);
    });
  });
});
