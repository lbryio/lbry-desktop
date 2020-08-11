// @flow
import * as ICONS from 'constants/icons';
import { NOTIFICATION_COMMENT } from 'constants/notifications';
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import Notification from 'component/notification';
import Yrbl from 'component/yrbl';
import Button from 'component/button';

type Props = {
  notifications: ?Array<Notification>,
  fetching: boolean,
  unreadCount: number,
  doReadNotifications: () => void,
};

export default function NotificationsPage(props: Props) {
  const { notifications, fetching, unreadCount, doReadNotifications } = props;

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

  React.useEffect(() => {
    if (unreadCount > 0) {
      doReadNotifications();
    }
  }, [unreadCount, doReadNotifications]);

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
        <div className="main--empty">
          <Yrbl
            title={__('No Notifications')}
            subtitle={
              <div>
                <p>{__("You don't have any notifications yet, but they will be here when you do!")}</p>
                <div className="section__actions">
                  <Button button="primary" icon={ICONS.HOME} label={__('Go Home')} navigate="/" />
                </div>
              </div>
            }
          />
        </div>
      )}
    </Page>
  );
}
