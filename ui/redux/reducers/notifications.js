// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: NotificationState = {
  notifications: [],
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
      newToasts.pop();

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

      const markIdsAsRead = (list, ids) => {
        return (
          list &&
          list.map((n) => {
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

      const markIdsAsSeen = (list, ids) => {
        return list.map((n) => {
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

      const deleteId = (list, id) => {
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
