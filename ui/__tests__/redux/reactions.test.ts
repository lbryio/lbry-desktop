import * as ACTIONS from "constants/action_types";
import * as REACTION_TYPES from "constants/reactions";
import reducer from "redux/reducers/reactions";

const init = () => reducer(undefined, { type: "@@INIT" });
const act = (state: any, type: string, data: any = {}) => reducer(state, { type, data });

const entry = (like = 0, dislike = 0) => ({
  my_reactions: { c1: { [REACTION_TYPES.LIKE]: like, [REACTION_TYPES.DISLIKE]: dislike } },
  others_reactions: { c1: { [REACTION_TYPES.LIKE]: 5, [REACTION_TYPES.DISLIKE]: 1 } },
});
const withEntry = (like = 0, dislike = 0) => ({ ...init(), reactionsById: { c1: entry(like, dislike) } });
const mine = (state: any) => state.reactionsById.c1.my_reactions.c1;

describe("reactions reducer: fetching flag (#708)", () => {
  it("is set by STARTED and cleared by COMPLETED", () => {
    const started = act(init(), ACTIONS.REACTIONS_LIST_STARTED);
    expect(started.fetchingReactions).toBe(true);

    const done = act(started, ACTIONS.REACTIONS_LIST_COMPLETED, { claimId: "c1", reactions: entry() });
    expect(done.fetchingReactions).toBe(false);
    expect(done.reactionsById.c1).toEqual(entry());
  });

  it("is cleared by FAILED, which also records the error", () => {
    const started = act(init(), ACTIONS.REACTIONS_LIST_STARTED);
    const failed = act(started, ACTIONS.REACTIONS_LIST_FAILED, "boom");
    expect(failed.fetchingReactions).toBe(false);
    expect(failed.reactionsError).toBe("boom");
  });

  it("never adds a differently-cased key", () => {
    const state = act(act(init(), ACTIONS.REACTIONS_LIST_STARTED), ACTIONS.REACTIONS_LIST_COMPLETED, {
      claimId: "c1",
      reactions: entry(),
    });
    expect(Object.keys(state).filter((k) => k.toLowerCase() === "fetchingreactions")).toEqual(["fetchingReactions"]);
  });

  it("is left alone by a like or dislike finishing during a list fetch", () => {
    const state = { ...withEntry(), fetchingReactions: true };
    expect(act(state, ACTIONS.REACTIONS_LIKE_COMPLETED, { claimId: "c1", shouldRemove: false }).fetchingReactions).toBe(
      true
    );
    expect(
      act(state, ACTIONS.REACTIONS_DISLIKE_COMPLETED, { claimId: "c1", shouldRemove: false }).fetchingReactions
    ).toBe(true);
  });
});

describe("reactions reducer: like and dislike", () => {
  const like = (state: any, shouldRemove = false) =>
    act(state, ACTIONS.REACTIONS_LIKE_COMPLETED, { claimId: "c1", shouldRemove });
  const dislike = (state: any, shouldRemove = false) =>
    act(state, ACTIONS.REACTIONS_DISLIKE_COMPLETED, { claimId: "c1", shouldRemove });

  it("liking sets like and clears dislike", () => {
    expect(mine(like(withEntry(0, 1)))).toEqual({ [REACTION_TYPES.LIKE]: 1, [REACTION_TYPES.DISLIKE]: 0 });
  });

  it("removing a like clears it", () => {
    expect(mine(like(withEntry(1, 0), true))).toEqual({ [REACTION_TYPES.LIKE]: 0, [REACTION_TYPES.DISLIKE]: 0 });
  });

  it("disliking sets dislike and clears like", () => {
    expect(mine(dislike(withEntry(1, 0)))).toEqual({ [REACTION_TYPES.LIKE]: 0, [REACTION_TYPES.DISLIKE]: 1 });
  });

  it("removing a dislike clears it", () => {
    expect(mine(dislike(withEntry(0, 1), true))).toEqual({ [REACTION_TYPES.LIKE]: 0, [REACTION_TYPES.DISLIKE]: 0 });
  });

  it("keeps other reaction data on the same claim", () => {
    expect(like(withEntry()).reactionsById.c1.others_reactions).toEqual(entry().others_reactions);
  });

  it("does not mutate the previous state", () => {
    const before = withEntry(0, 1);
    const snapshot = JSON.parse(JSON.stringify(before));
    like(before);
    dislike(before);
    expect(before).toEqual(snapshot);
  });

  it("returns new objects down the changed path, and leaves other claims shared", () => {
    const before = { ...init(), reactionsById: { c1: entry(), c2: entry() } };
    const after = like(before);
    expect(after.reactionsById.c1).not.toBe(before.reactionsById.c1);
    expect(after.reactionsById.c1.my_reactions).not.toBe(before.reactionsById.c1.my_reactions);
    expect(after.reactionsById.c2).toBe(before.reactionsById.c2);
  });
});
