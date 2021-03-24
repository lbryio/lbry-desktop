// @flow
import * as ACTIONS from 'constants/action_types';
import * as NOTIFICATIONS from 'constants/notifications';
import { Lbryio } from 'lbryinc';
import { v4 as uuid } from 'uuid';
import { selectNotifications, selectNotificationsFiltered } from 'redux/selectors/notifications';
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

export function doNotificationList(rule: string = '') {
  return (dispatch: Dispatch) => {
    dispatch({ type: ACTIONS.NOTIFICATION_LIST_STARTED });

    let params: any = { is_app_readable: true };
    if (rule && rule !== NOTIFICATIONS.NOTIFICATION_RULE_NONE) {
      params.type = rule;
    }

    return Lbryio.call('notification', 'list', params)
      .then((response) => {
        const notifications = response || [];
        const channelsToResolve = notifications
          .filter((notification: WebNotification) => {
            if (
              (notification.notification_parameters.dynamic &&
                notification.notification_parameters.dynamic.comment_author) ||
              notification.notification_rule === NOTIFICATIONS.NEW_CONTENT
            ) {
              return true;
            } else {
              return false;
            }
          })
          .map((notification) => {
            if (notification.notification_rule === NOTIFICATIONS.NEW_CONTENT) {
              return notification.notification_parameters.device.target;
            } else {
              return notification.notification_parameters.dynamic.comment_author;
            }
          });

        dispatch(doResolveUris(channelsToResolve));
        dispatch({
          type: ACTIONS.NOTIFICATION_LIST_COMPLETED,
          data: {
            newNotifications: notifications,
            filterRule: rule,
          },
        });
      })
      .catch((error) => {
        dispatch({ type: ACTIONS.NOTIFICATION_LIST_FAILED, data: { error } });
      });
  };
}

export function doReadNotifications(notificationsIds: Array<number>) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const notifications = selectNotifications(state);
    const notificationsFiltered = selectNotificationsFiltered(state);

    if (!notifications || !notificationsFiltered) {
      return;
    }

    let ids;
    if (notificationsIds && Array.isArray(notificationsIds) && notificationsIds.length !== 0) {
      // Wipe specified notifications.
      ids = notificationsIds;
    } else {
      // A null or invalid argument will wipe all unread notifications.
      const getUnreadIds = (list) => list.filter((n) => !n.is_read).map((n) => n.id);
      ids = [...new Set([...getUnreadIds(notifications), ...getUnreadIds(notificationsFiltered)])];
    }

    dispatch({ type: ACTIONS.NOTIFICATION_READ_STARTED });
    return Lbryio.call('notification', 'edit', { notification_ids: ids.join(','), is_read: true })
      .then(() => {
        dispatch({ type: ACTIONS.NOTIFICATION_READ_COMPLETED, data: { notificationIds: ids } });
      })
      .catch((error) => {
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
      .catch((error) => {
        dispatch({ type: ACTIONS.NOTIFICATION_SEEN_FAILED, data: { error } });
      });
  };
}

export function doSeeAllNotifications() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const notifications = selectNotifications(state);
    const notificationsFiltered = selectNotificationsFiltered(state);

    if (!notifications || !notificationsFiltered) {
      return;
    }

    const getUnseenIds = (list) => list.filter((n) => !n.is_seen).map((n) => n.id);
    const unseenIds = [...new Set([...getUnseenIds(notifications), ...getUnseenIds(notificationsFiltered)])];

    dispatch(doSeeNotifications(unseenIds));
  };
}

export function doDeleteNotification(notificationId: number) {
  return (dispatch: Dispatch) => {
    Lbryio.call('notification', 'delete', { notification_ids: notificationId })
      .then(() => {
        dispatch({ type: ACTIONS.NOTIFICATION_DELETE_COMPLETED, data: { notificationId } });
      })
      .catch(() => {
        dispatch(doToast({ isError: true, message: __('Unable to delete this right now. Please try again later.') }));
      });
  };
}
