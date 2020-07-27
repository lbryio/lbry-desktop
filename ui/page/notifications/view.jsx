// @flow
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

  return (
    <Page>
      {fetching && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      {notifications && notifications.length > 0 ? (
        <Card
          isBodyList
          title={__('Notifications')}
          body={
            <div className="notification_list">
              {notifications.map((notification, index) => {
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
