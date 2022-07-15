import { createSelector } from 'reselect';

export const selectState = (state) => state.notifications || {};

export const selectNotifications = (state) => selectState(state).notifications;
export const selectNotificationsFiltered = (state) => selectState(state).notificationsFiltered;
export const selectNotificationCategories = (state) => selectState(state).notificationCategories;

export const makeSelectNotificationForCommentId = (id) =>
  createSelector(selectNotifications, (notifications) => {
    const match =
      notifications &&
      notifications.find(
        (n) =>
          n.notification_parameters &&
          n.notification_parameters.dynamic &&
          n.notification_parameters.dynamic.hash === id
      );
    return match;
  });

export const selectIsFetchingNotifications = (state) => selectState(state).fetchingNotifications;

export const selectUnreadNotificationCount = createSelector(selectNotifications, (notifications) => {
  return notifications ? notifications.filter((notification) => !notification.is_read).length : 0;
});

export const selectUnseenNotificationCount = createSelector(selectNotifications, (notifications) => {
  return notifications ? notifications.filter((notification) => !notification.is_seen).length : 0;
});

export const selectToast = createSelector(selectState, (state) => {
  if (state.toasts.length) {
    const { id, params } = state.toasts[state.toasts.length - 1];
    return {
      id,
      ...params,
    };
  }

  return null;
});

export const selectToastCount = (state) => selectState(state).toasts.length;

export const selectError = createSelector(selectState, (state) => {
  if (state.errors.length) {
    const { error } = state.errors[0];
    return {
      error,
    };
  }

  return null;
});
