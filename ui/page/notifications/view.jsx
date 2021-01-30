// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import Notification from 'component/notification';
import Button from 'component/button';
import Yrbl from 'component/yrbl';

type Props = {
  notifications: Array<Notification>,
  fetching: boolean,
  unreadCount: number,
  unseenCount: number,
  doSeeAllNotifications: () => void,
  doReadNotifications: () => void,
};

export default function NotificationsPage(props: Props) {
  const { notifications, fetching, unreadCount, unseenCount, doSeeAllNotifications, doReadNotifications } = props;
  const hasNotifications = notifications.length > 0;

  React.useEffect(() => {
    if (unseenCount > 0) {
      doSeeAllNotifications();
    }
  }, [unseenCount, doSeeAllNotifications]);

  return (
    <Page>
      {fetching && !hasNotifications && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      {!fetching && (
        <>
          {notifications && notifications.length > 0 ? (
            <Card
              isBodyList
              title={
                <span>
                  {__('Notifications')}
                  {fetching && <Spinner type="small" />}
                </span>
              }
              titleActions={
                unreadCount > 0 && (
                  <Button
                    icon={ICONS.EYE}
                    onClick={doReadNotifications}
                    button="secondary"
                    label={__('Mark all as read')}
                  />
                )
              }
              body={
                <div className="notification_list">
                  {notifications.map((notification, index) => {
                    return <Notification key={notification.id} notification={notification} />;
                  })}
                </div>
              }
            />
          ) : (
            <div className="main--empty">
              <Yrbl
                title={__('No notifications')}
                subtitle={<p>{__("You don't have any notifications yet, but they will be here when you do!")}</p>}
                actions={
                  <div className="section__actions">
                    <Button button="primary" icon={ICONS.HOME} label={__('Go Home')} navigate="/" />
                  </div>
                }
              />
            </div>
          )}
        </>
      )}
    </Page>
  );
}
