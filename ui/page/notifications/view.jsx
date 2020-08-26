// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import Notification from 'component/notification';
import Button from 'component/button';
import Yrbl from 'component/yrbl';
import usePrevious from 'effects/use-previous';

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
  const [hasFetched, setHasFetched] = React.useState(false);
  const previousFetching = usePrevious(fetching);
  const hasNotifications = notifications.length > 0;

  React.useEffect(() => {
    if (unreadCount > 0) {
      doReadNotifications();
    }
  }, [unreadCount, doReadNotifications]);

  React.useEffect(() => {
    if ((fetching === false && previousFetching === true) || hasNotifications) {
      setHasFetched(true);
    }
  }, [fetching, previousFetching, setHasFetched, hasNotifications]);

  return (
    <Page>
      {fetching && !hasNotifications && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      {hasFetched && (
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
                unseenCount > 0 && (
                  <Button
                    icon={ICONS.EYE}
                    onClick={doSeeAllNotifications}
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
        </>
      )}
    </Page>
  );
}
