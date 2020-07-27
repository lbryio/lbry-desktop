// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: NotificationState = {
  notifications: [],
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
      const { notifications } = action.data;
      return {
        ...state,
        notifications,
        fetchingNotifications: false,
      };
    },
    [ACTIONS.NOTIFICATION_LIST_FAILED]: (state, action) => {
      return {
        ...state,
        fetchingNotifications: false,
      };
    },
    [ACTIONS.NOTIFICATION_READ_COMPLETED]: (state, action) => {
      const { notifications } = state;
      const newNotifications = notifications && notifications.map(notification => ({ ...notification, is_read: true }));
      return {
        ...state,
        notifications: newNotifications,
      };
    },
    [ACTIONS.NOTIFICATION_READ_FAILED]: (state, action) => {
      return {
        ...state,
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
