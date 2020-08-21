// @flow
import * as ACTIONS from 'constants/action_types';
import { Lbryio } from 'lbryinc';
import uuid from 'uuid/v4';
import { selectNotifications } from 'redux/selectors/notifications';
import { doResolveUris } from 'lbry-redux';

export function doToast(params: ToastParams) {
  if (!params) {
    throw Error("'params' object is required to create a toast notification");
  }

  return {
    type: ACTIONS.CREATE_TOAST,
    data: {
      id: uuid(),
      params,
    },
  };
}

export function doDismissToast() {
  return {
    type: ACTIONS.DISMISS_TOAST,
  };
}

export function doError(error: string | {}) {
  return {
    type: ACTIONS.CREATE_ERROR,
    data: {
      error,
    },
  };
}

export function doDismissError() {
  return {
    type: ACTIONS.DISMISS_ERROR,
  };
}

export function doNotificationList() {
  return (dispatch: Dispatch) => {
    dispatch({ type: ACTIONS.NOTIFICATION_LIST_STARTED });
    return Lbryio.call('notification', 'list')
      .then(response => {
        const notifications = response || [];
        const channelsToResolve = notifications
          .filter((notification: WebNotification) => {
            if (
              notification.notification_parameters.dynamic &&
              notification.notification_parameters.dynamic.comment_author
            ) {
              return true;
            } else {
              return false;
            }
          })
          .map(notification => notification.notification_parameters.dynamic.comment_author);

        dispatch(doResolveUris(channelsToResolve));
        dispatch({ type: ACTIONS.NOTIFICATION_LIST_COMPLETED, data: { notifications } });
      })
      .catch(error => {
        dispatch({ type: ACTIONS.NOTIFICATION_LIST_FAILED, data: { error } });
      });
  };
}

export function doReadNotifications() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const notifications = selectNotifications(state);
    const unreadNotifications =
      notifications &&
      notifications
        .filter(notification => !notification.is_read)
        .map(notification => notification.id)
        .join(',');

    dispatch({ type: ACTIONS.NOTIFICATION_READ_STARTED });
    return Lbryio.call('notification', 'edit', { notification_ids: unreadNotifications, is_read: true })
      .then(() => {
        dispatch({ type: ACTIONS.NOTIFICATION_READ_COMPLETED });
      })
      .catch(error => {
        dispatch({ type: ACTIONS.NOTIFICATION_READ_FAILED, data: { error } });
      });
  };
}

export function doSeeNotifications(notificationIds: Array<string>) {
  return (dispatch: Dispatch) => {
    dispatch({ type: ACTIONS.NOTIFICATION_SEEN_STARTED });
    return Lbryio.call('notification', 'edit', { notification_ids: notificationIds.join(','), is_seen: true })
      .then(() => {
        dispatch({
          type: ACTIONS.NOTIFICATION_SEEN_COMPLETED,
          data: {
            notificationIds,
          },
        });
      })
      .catch(error => {
        dispatch({ type: ACTIONS.NOTIFICATION_SEEN_FAILED, data: { error } });
      });
  };
}

export function doSeeAllNotifications() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const notifications = selectNotifications(state);
    const unSeenNotifications =
      notifications && notifications.filter(notification => !notification.is_seen).map(notification => notification.id);

    dispatch(doSeeNotifications(unSeenNotifications));
  };
}
