import { createSelector } from 'reselect';

export const selectState = (state) => state.notifications || {};

export const selectNotifications = createSelector(selectState, (state) => state.notifications);

export const selectNotificationsFiltered = createSelector(selectState, (state) => state.notificationsFiltered);

export const selectNotificationCategories = createSelector(selectState, (state) => state.notificationCategories);

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

export const selectIsFetchingNotifications = createSelector(selectState, (state) => state.fetchingNotifications);

export const selectUnreadNotificationCount = createSelector(selectNotifications, (notifications) => {
  return notifications ? notifications.filter((notification) => !notification.is_read).length : 0;
});

export const selectUnseenNotificationCount = createSelector(selectNotifications, (notifications) => {
  return notifications ? notifications.filter((notification) => !notification.is_seen).length : 0;
});

export const selectToast = createSelector(selectState, (state) => {
  if (state.toasts.length) {
    const { id, params } = state.toasts[0];
    return {
      id,
      ...params,
    };
  }

  return null;
});

export const selectError = createSelector(selectState, (state) => {
  if (state.errors.length) {
    const { error } = state.errors[0];
    return {
      error,
    };
  }

  return null;
});
