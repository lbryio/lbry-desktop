import * as ACTIONS from "constants/action_types";
import reducer from "redux/reducers/sync";

const init = () => reducer(undefined, { type: "@@INIT" });
const act = (state: any, type: string, data: any = {}) => reducer(state, { type, data });

describe("sync reducer", () => {
  it("returns the same state for an unknown action", () => {
    const state = init();
    expect(reducer(state, { type: "NOPE" })).toBe(state);
  });

  describe("getting the synced wallet", () => {
    it("STARTED sets pending and clears the previous error", () => {
      const state = act({ ...init(), getSyncErrorMessage: "old" }, ACTIONS.GET_SYNC_STARTED);
      expect(state.getSyncIsPending).toBe(true);
      expect(state.getSyncErrorMessage).toBeNull();
    });

    it("COMPLETED stores the hash and data", () => {
      const state = act(init(), ACTIONS.GET_SYNC_COMPLETED, {
        syncHash: "h",
        syncData: "d",
        hasSyncedWallet: true,
        hashChanged: true,
        fatalError: false,
      });
      expect(state).toMatchObject({
        syncHash: "h",
        syncData: "d",
        hasSyncedWallet: true,
        hashChanged: true,
        getSyncIsPending: false,
      });
    });

    it("FAILED records the error and stops pending", () => {
      const state = act({ ...init(), getSyncIsPending: true }, ACTIONS.GET_SYNC_FAILED, { error: "nope" });
      expect(state).toMatchObject({ getSyncIsPending: false, getSyncErrorMessage: "nope" });
    });
  });

  describe("setting the synced wallet", () => {
    it("COMPLETED marks the user as having a synced wallet", () => {
      const state = act({ ...init(), setSyncIsPending: true, setSyncErrorMessage: "old" }, ACTIONS.SET_SYNC_COMPLETED, {
        syncHash: "h2",
      });
      expect(state).toMatchObject({
        hasSyncedWallet: true,
        syncHash: "h2",
        setSyncIsPending: false,
        setSyncErrorMessage: null,
      });
    });

    it("FAILED records the error and does not claim a synced wallet", () => {
      const state = act({ ...init(), setSyncIsPending: true }, ACTIONS.SET_SYNC_FAILED, { error: "x" });
      expect(state).toMatchObject({ setSyncIsPending: false, setSyncErrorMessage: "x", hasSyncedWallet: false });
    });
  });

  describe("applying a synced wallet", () => {
    it("STARTED clears the previous password error and message", () => {
      const state = act(
        { ...init(), syncApplyPasswordError: true, syncApplyErrorMessage: "bad" },
        ACTIONS.SYNC_APPLY_STARTED
      );
      expect(state).toMatchObject({
        syncApplyIsPending: true,
        syncApplyPasswordError: false,
        syncApplyErrorMessage: "",
      });
    });

    it("BAD_PASSWORD flags the password error; FAILED stores the message", () => {
      expect(act(init(), ACTIONS.SYNC_APPLY_BAD_PASSWORD).syncApplyPasswordError).toBe(true);
      expect(act(init(), ACTIONS.SYNC_APPLY_FAILED, { error: "e" })).toMatchObject({
        syncApplyIsPending: false,
        syncApplyErrorMessage: "e",
      });
    });
  });

  it("SYNC_STATE_POPULATE marks prefs ready once", () => {
    expect(act(init(), ACTIONS.SYNC_STATE_POPULATE).prefsReady).toBe(true);
  });

  it("SET_PREFS_READY and SET_SYNC_LOCK store their value", () => {
    expect(act(init(), ACTIONS.SET_PREFS_READY, true).prefsReady).toBe(true);
    expect(act(init(), ACTIONS.SET_SYNC_LOCK, true).syncLocked).toBe(true);
  });

  it("SYNC_FATAL_ERROR sets the flag and SYNC_RESET returns to the defaults", () => {
    const broken = act({ ...init(), syncHash: "h" }, ACTIONS.SYNC_FATAL_ERROR);
    expect(broken.fatalError).toBe(true);
    expect(act(broken, ACTIONS.SYNC_RESET)).toEqual(init());
  });
});
