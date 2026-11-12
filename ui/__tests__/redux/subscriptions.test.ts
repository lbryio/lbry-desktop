import * as ACTIONS from "constants/action_types";
import reducer from "redux/reducers/subscriptions";

const init = () => reducer(undefined, { type: "@@INIT" });
const act = (state: any, type: string, data: any = {}) => reducer(state, { type, data });
const URI = "lbry://@alice#a1b2c3";

describe("subscriptions reducer", () => {
  describe("CHANNEL_SUBSCRIBE", () => {
    const sub = (uri = URI, notificationsDisabled = false) => ({ uri, channelName: "@alice", notificationsDisabled });

    it("adds the channel to subscriptions and following", () => {
      const state = act(init(), ACTIONS.CHANNEL_SUBSCRIBE, sub());
      expect(state.subscriptions).toHaveLength(1);
      expect(state.following).toEqual([{ uri: URI, notificationsDisabled: false }]);
    });

    it("puts the newest subscription first", () => {
      let state = act(init(), ACTIONS.CHANNEL_SUBSCRIBE, sub(URI));
      state = act(state, ACTIONS.CHANNEL_SUBSCRIBE, sub("lbry://@bob#d4e5f6"));
      expect(state.following.map((f: any) => f.uri)).toEqual(["lbry://@bob#d4e5f6", URI]);
    });

    it("subscribing twice doesn't duplicate, but updates the notification setting", () => {
      let state = act(init(), ACTIONS.CHANNEL_SUBSCRIBE, sub(URI, false));
      state = act(state, ACTIONS.CHANNEL_SUBSCRIBE, sub(URI, true));
      expect(state.subscriptions).toHaveLength(1);
      expect(state.following).toHaveLength(1);
      expect(state.following[0].notificationsDisabled).toBe(true);
    });
  });

  it("CHANNEL_UNSUBSCRIBE removes the channel from both lists and leaves others", () => {
    let state = act(init(), ACTIONS.CHANNEL_SUBSCRIBE, {
      uri: URI,
      channelName: "@alice",
      notificationsDisabled: false,
    });
    state = act(state, ACTIONS.CHANNEL_SUBSCRIBE, {
      uri: "lbry://@bob#d4e5f6",
      channelName: "@bob",
      notificationsDisabled: false,
    });
    state = act(state, ACTIONS.CHANNEL_UNSUBSCRIBE, { uri: URI });
    expect(state.subscriptions.map((s: any) => s.uri)).toEqual(["lbry://@bob#d4e5f6"]);
    expect(state.following.map((s: any) => s.uri)).toEqual(["lbry://@bob#d4e5f6"]);
  });

  it("tracks loading across FETCH_SUBSCRIPTIONS_*", () => {
    const started = act(init(), ACTIONS.FETCH_SUBSCRIPTIONS_START);
    expect(started.loading).toBe(true);
    expect(act(started, ACTIONS.FETCH_SUBSCRIPTIONS_FAIL).loading).toBe(false);
    const done = act(started, ACTIONS.FETCH_SUBSCRIPTIONS_SUCCESS, [{ uri: URI }]);
    expect(done).toMatchObject({ loading: false, subscriptions: [{ uri: URI }] });
  });

  it("SET_VIEW_MODE stores the mode", () => {
    expect(act(init(), ACTIONS.SET_VIEW_MODE, "list").viewMode).toBe("list");
  });

  describe("SYNC_STATE_POPULATE", () => {
    const populate = (state: any, data: any) => act(state, ACTIONS.SYNC_STATE_POPULATE, data);

    it("builds subscriptions from synced uris, with the @channel name", () => {
      const state = populate(init(), { subscriptions: [URI], following: null });
      expect(state.subscriptions).toEqual([{ uri: URI, channelName: "@alice" }]);
    });

    it("derives following from subscriptions when sync has no following list", () => {
      const state = populate(init(), { subscriptions: [URI], following: null });
      expect(state.following).toEqual([{ uri: URI, notificationsDisabled: false }]);
    });

    it("uses the synced following list when there is one", () => {
      const following = [{ uri: URI, notificationsDisabled: true }];
      expect(populate(init(), { subscriptions: [URI], following }).following).toEqual(following);
    });

    it("ignores a sync with no subscriptions list", () => {
      const state = act(init(), ACTIONS.CHANNEL_SUBSCRIBE, {
        uri: URI,
        channelName: "@alice",
        notificationsDisabled: false,
      });
      expect(populate(state, { subscriptions: null, following: null }).subscriptions).toEqual(state.subscriptions);
    });
  });
});
