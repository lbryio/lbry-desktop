import * as ACTIONS from "constants/action_types";
import reducer from "redux/reducers/notifications";

const init = () => reducer(undefined, { type: "@@INIT" });
const act = (state: any, type: string, data: any = {}) => reducer(state, { type, data });
const n = (id: number, extra: any = {}) => ({ id, is_read: false, is_seen: false, ...extra });

describe("notifications reducer", () => {
  describe("toasts and errors are queues", () => {
    it("CREATE_TOAST appends and DISMISS_TOAST removes the oldest", () => {
      let state = act(init(), ACTIONS.CREATE_TOAST, { id: "one" });
      state = act(state, ACTIONS.CREATE_TOAST, { id: "two" });
      expect(state.toasts).toEqual([{ id: "one" }, { id: "two" }]);
      expect(act(state, ACTIONS.DISMISS_TOAST).toasts).toEqual([{ id: "two" }]);
    });

    it("DISMISS_TOAST on an empty queue is harmless", () => {
      expect(act(init(), ACTIONS.DISMISS_TOAST).toasts).toEqual([]);
    });

    it("CREATE_ERROR appends and DISMISS_ERROR removes the oldest", () => {
      const state = act(act(init(), ACTIONS.CREATE_ERROR, { error: "a" }), ACTIONS.CREATE_ERROR, { error: "b" });
      expect(act(state, ACTIONS.DISMISS_ERROR).errors).toEqual([{ error: "b" }]);
    });
  });

  describe("listing", () => {
    it("NOTIFICATION_LIST_STARTED/FAILED toggle the fetching flag", () => {
      const started = act(init(), ACTIONS.NOTIFICATION_LIST_STARTED);
      expect(started.fetchingNotifications).toBe(true);
      expect(act(started, ACTIONS.NOTIFICATION_LIST_FAILED).fetchingNotifications).toBe(false);
    });

    it("an unfiltered list replaces notifications only", () => {
      const next = act(init(), ACTIONS.NOTIFICATION_LIST_COMPLETED, { newNotifications: [n(1)] });
      expect(next.notifications).toEqual([n(1)]);
      expect(next.notificationsFiltered).toEqual([]);
      expect(next.fetchingNotifications).toBe(false);
    });

    it("a filtered list replaces notificationsFiltered only", () => {
      const next = act(init(), ACTIONS.NOTIFICATION_LIST_COMPLETED, {
        filterRule: "comments",
        newNotifications: [n(2)],
      });
      expect(next.notificationsFiltered).toEqual([n(2)]);
      expect(next.notifications).toEqual([]);
    });
  });

  describe("marking", () => {
    const state = () => ({ ...init(), notifications: [n(1), n(2)], notificationsFiltered: [n(2), n(3)] });

    it("NOTIFICATION_READ_COMPLETED marks the ids read in both lists", () => {
      const next = act(state(), ACTIONS.NOTIFICATION_READ_COMPLETED, { notificationIds: [2] });
      expect(next.notifications.map((x: any) => x.is_read)).toEqual([false, true]);
      expect(next.notificationsFiltered.map((x: any) => x.is_read)).toEqual([true, false]);
    });

    it("NOTIFICATION_SEEN_COMPLETED marks the ids seen in both lists", () => {
      const next = act(state(), ACTIONS.NOTIFICATION_SEEN_COMPLETED, { notificationIds: [1, 3] });
      expect(next.notifications.map((x: any) => x.is_seen)).toEqual([true, false]);
      expect(next.notificationsFiltered.map((x: any) => x.is_seen)).toEqual([false, true]);
    });

    it("NOTIFICATION_DELETE_COMPLETED removes the id from both lists", () => {
      const next = act(state(), ACTIONS.NOTIFICATION_DELETE_COMPLETED, { notificationId: 2 });
      expect(next.notifications.map((x: any) => x.id)).toEqual([1]);
      expect(next.notificationsFiltered.map((x: any) => x.id)).toEqual([3]);
    });
  });

  it("NOTIFICATION_CATEGORIES_COMPLETED stores the categories", () => {
    expect(
      act(init(), ACTIONS.NOTIFICATION_CATEGORIES_COMPLETED, { notificationCategories: ["c"] }).notificationCategories
    ).toEqual(["c"]);
  });
});
