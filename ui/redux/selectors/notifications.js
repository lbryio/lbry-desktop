import { createSelector } from 'reselect';

export const selectState = state => state.notifications || {};

export const selectNotifications = createSelector(selectState, state => state.notifications);

export const selectIsFetchingNotifications = createSelector(selectState, state => state.fetchingNotifications);

export const selectUnreadNotificationCount = createSelector(selectNotifications, notifications => {
  return notifications ? notifications.filter(notification => !notification.is_read).length : 0;
});

export const selectToast = createSelector(selectState, state => {
  if (state.toasts.length) {
    const { id, params } = state.toasts[0];
    return {
      id,
      ...params,
    };
  }

  return null;
});

export const selectError = createSelector(selectState, state => {
  if (state.errors.length) {
    const { error } = state.errors[0];
    return {
      error,
    };
  }

  return null;
});
