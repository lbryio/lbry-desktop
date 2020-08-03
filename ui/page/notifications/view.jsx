// @flow
import { NOTIFICATION_COMMENT } from 'constants/notifications';
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import Notification from 'component/notification';

type Props = {
  notifications: ?Array<Notification>,
  fetching: boolean,
};

export default function NotificationsPage(props: Props) {
  const { notifications, fetching } = props;

  // Group sequential comment notifications if they are by the same author
  let groupedCount = 1;
  const groupedNotifications =
    notifications &&
    notifications.reduce((list, notification, index) => {
      if (index === 0) {
        return [notification];
      }

      const previousNotification = notifications[index - 1];
      const isCommentNotification = notification.notification_rule === NOTIFICATION_COMMENT;
      const previousIsCommentNotification = previousNotification.notification_rule === NOTIFICATION_COMMENT;
      if (isCommentNotification && previousIsCommentNotification) {
        const notificationTarget = notification.notification_parameters.device.target;
        const previousTarget = previousNotification && previousNotification.notification_parameters.device.target;
        const author = notification.notification_parameters.dynamic.comment_author;
        const previousAuthor = previousNotification.notification_parameters.dynamic.comment_author;

        if (author === previousAuthor && notificationTarget === previousTarget) {
          const newList = [...list];
          newList.pop();
          groupedCount += 1;
          const newNotification = {
            ...previousNotification,
            group_count: groupedCount,
          };

          newList[index - groupedCount] = newNotification;
          return newList;
        } else {
          if (groupedCount > 1) {
            groupedCount = 1;
          }

          return [...list, notification];
        }
      } else {
        if (groupedCount > 1) {
          groupedCount = 1;
        }

        return [...list, notification];
      }
    }, []);

  return (
    <Page>
      {fetching && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      {groupedNotifications && groupedNotifications.length > 0 ? (
        <Card
          isBodyList
          title={__('Notifications')}
          body={
            <div className="notification_list">
              {groupedNotifications.map((notification, index) => {
                if (!notification) {
                  return null;
                }

                return <Notification key={notification.id} notification={notification} />;
              })}
            </div>
          }
        />
      ) : (
        <div>{__('No notifications')}</div>
      )}
    </Page>
  );
}
