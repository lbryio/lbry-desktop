import * as ACTIONS from "constants/action_types";
import { handleActions } from "util/redux-utils";

const defaultState: NotificationState = {
  notifications: [],
  // @ts-expect-error - TS2322 - Type '{ notifications: undefined[]; notificationsFiltered: undefined[]; notificationCategories: undefined; fetchingNotifications: boolean; toasts: undefined[]; errors: undefined[]; }' is not assignable to type 'NotificationState'.
  notificationsFiltered: [],
  notificationCategories: undefined,
  fetchingNotifications: false,
  toasts: [],
  errors: [],
};

export default handleActions(
  {
    // Toasts
    [ACTIONS.CREATE_TOAST]: (state: NotificationState, action: DoToast) => {
      const toast: Toast = action.data;
      const newToasts: Array<Toast> = state.toasts.slice();
      newToasts.push(toast);

      return {
        ...state,
        toasts: newToasts,
      };
    },
    [ACTIONS.DISMISS_TOAST]: (state: NotificationState) => {
      const newToasts: Array<Toast> = state.toasts.slice();
      newToasts.shift();

      return {
        ...state,
        toasts: newToasts,
      };
    },

    // Notifications
    [ACTIONS.NOTIFICATION_LIST_STARTED]: (state, action) => {
      return {
        ...state,
        fetchingNotifications: true,
      };
    },
    [ACTIONS.NOTIFICATION_LIST_COMPLETED]: (state, action) => {
      const { filterRule, newNotifications } = action.data;
      if (filterRule) {
        return {
          ...state,
          notificationsFiltered: newNotifications,
          fetchingNotifications: false,
        };
      } else {
        return {
          ...state,
          notifications: newNotifications,
          fetchingNotifications: false,
        };
      }
    },
    [ACTIONS.NOTIFICATION_LIST_FAILED]: (state, action) => {
      return {
        ...state,
        fetchingNotifications: false,
      };
    },
    [ACTIONS.NOTIFICATION_CATEGORIES_COMPLETED]: (state, action) => {
      const { notificationCategories } = action.data;

      return {
        ...state,
        notificationCategories,
      };
    },
    [ACTIONS.NOTIFICATION_READ_COMPLETED]: (state, action) => {
      const { notifications, notificationsFiltered } = state;
      const { notificationIds } = action.data;

      const markIdsAsRead = (list: unknown, ids: unknown) => {
        return (
          list &&
          // @ts-expect-error - TS2339 - Property 'map' does not exist on type 'unknown'.
          list.map((n) => {
            // @ts-expect-error - TS2339 - Property 'includes' does not exist on type 'unknown'.
            if (ids.includes(n.id)) {
              return { ...n, is_read: true };
            } else {
              return { ...n };
            }
          })
        );
      };

      return {
        ...state,
        notifications: markIdsAsRead(notifications, notificationIds),
        notificationsFiltered: markIdsAsRead(notificationsFiltered, notificationIds),
      };
    },
    [ACTIONS.NOTIFICATION_READ_FAILED]: (state, action) => {
      return {
        ...state,
      };
    },
    [ACTIONS.NOTIFICATION_SEEN_COMPLETED]: (state, action) => {
      const { notifications, notificationsFiltered } = state;
      const { notificationIds } = action.data;

      const markIdsAsSeen = (list: unknown, ids: unknown) => {
        // @ts-expect-error - TS2339 - Property 'map' does not exist on type 'unknown'.
        return list.map((n) => {
          // @ts-expect-error - TS2339 - Property 'includes' does not exist on type 'unknown'.
          if (ids.includes(n.id)) {
            return { ...n, is_seen: true };
          }
          return n;
        });
      };

      return {
        ...state,
        notifications: markIdsAsSeen(notifications, notificationIds),
        notificationsFiltered: markIdsAsSeen(notificationsFiltered, notificationIds),
      };
    },
    [ACTIONS.NOTIFICATION_DELETE_COMPLETED]: (state, action) => {
      const { notifications, notificationsFiltered } = state;
      const { notificationId } = action.data;

      const deleteId = (list: unknown, id: unknown) => {
        // @ts-expect-error - TS2339 - Property 'filter' does not exist on type 'unknown'.
        return list.filter((n) => n.id !== id);
      };

      return {
        ...state,
        notifications: deleteId(notifications, notificationId),
        notificationsFiltered: deleteId(notificationsFiltered, notificationId),
      };
    },

    // Errors
    [ACTIONS.CREATE_ERROR]: (state: NotificationState, action: DoError) => {
      const error: ErrorNotification = action.data;
      const newErrors: Array<ErrorNotification> = state.errors.slice();
      newErrors.push(error);

      return {
        ...state,
        errors: newErrors,
      };
    },
    [ACTIONS.DISMISS_ERROR]: (state: NotificationState) => {
      const newErrors: Array<ErrorNotification> = state.errors.slice();
      newErrors.shift();

      return {
        ...state,
        errors: newErrors,
      };
    },
  },
  defaultState
);
