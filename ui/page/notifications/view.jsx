// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Page from 'component/page';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';
import Notification from 'component/notification';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';
import Yrbl from 'component/yrbl';
import * as NOTIFICATIONS from 'constants/notifications';
import useFetched from 'effects/use-fetched';

type Props = {
  notifications: Array<Notification>,
  notificationsFiltered: Array<Notification>,
  notificationCategories: Array<NotificationCategory>,
  fetching: boolean,
  unreadCount: number,
  unseenCount: number,
  doSeeAllNotifications: () => void,
  doReadNotifications: () => void,
  doNotificationList: (?Array<string>) => void,
};

export default function NotificationsPage(props: Props) {
  const {
    notifications,
    notificationsFiltered,
    fetching,
    unreadCount,
    unseenCount,
    doSeeAllNotifications,
    doReadNotifications,
    doNotificationList,
    notificationCategories,
  } = props;
  const initialFetchDone = useFetched(fetching);
  const [name, setName] = usePersistedState('notifications--rule', NOTIFICATIONS.NOTIFICATION_NAME_ALL);
  const isFiltered = name !== NOTIFICATIONS.NOTIFICATION_NAME_ALL;
  const list = isFiltered ? notificationsFiltered : notifications;

  React.useEffect(() => {
    if (unseenCount > 0 || unreadCount > 0) {
      // If there are unread notifications when entering the page, reset to All.
      setName(NOTIFICATIONS.NOTIFICATION_NAME_ALL);
    }
  }, []);

  React.useEffect(() => {
    if (unseenCount > 0) {
      doSeeAllNotifications();
    }
  }, [unseenCount, doSeeAllNotifications]);

  const stringifiedNotificationCategories = JSON.stringify(notificationCategories);
  React.useEffect(() => {
    if (stringifiedNotificationCategories) {
      const arrayNotificationCategories = JSON.parse(stringifiedNotificationCategories);

      if (name !== NOTIFICATIONS.NOTIFICATION_NAME_ALL) {
        // Fetch filtered list when:
        // (1) 'name' changed
        // (2) new "all" notifications received (e.g. from websocket).
        try {
          const matchingCategory = arrayNotificationCategories.find((category) => category.name === name);
          if (matchingCategory) {
            doNotificationList(matchingCategory.types);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [name, notifications, stringifiedNotificationCategories]);

  const notificationListElement = (
    <>
      <div className="claim-list__header">
        <h1 className="card__title">{__('Notifications')}</h1>
        <div className="claim-list__alt-controls--wrap">
          {fetching && <Spinner type="small" />}

          {unreadCount > 0 && (
            <Button icon={ICONS.EYE} onClick={doReadNotifications} button="secondary" label={__('Mark all as read')} />
          )}
          {notificationCategories && (
            <FormField
              className="notification__filter"
              type="select"
              name="filter"
              value={name}
              onChange={(e) => setName(e.target.value)}
            >
              {notificationCategories.map((category) => {
                return (
                  <option key={category.name} value={category.name}>
                    {__(category.name)}
                  </option>
                );
              })}
            </FormField>
          )}
        </div>
      </div>
      {list && list.length > 0 && !(isFiltered && fetching) ? (
        <div className="card">
          <div className="notification_list">
            {list.map((notification, index) => {
              return <Notification key={notification.id} notification={notification} />;
            })}
          </div>
        </div>
      ) : (
        <div className="main--empty">
          {!fetching && (
            <Yrbl
              title={__('No notifications')}
              subtitle={
                <p>
                  {isFiltered
                    ? __('Try selecting another filter.')
                    : __("You don't have any notifications yet, but they will be here when you do!")}
                </p>
              }
              actions={
                <div className="section__actions">
                  <Button button="primary" icon={ICONS.HOME} label={__('Go Home')} navigate="/" />
                </div>
              }
            />
          )}
        </div>
      )}
    </>
  );

  return (
    <Page>
      {initialFetchDone ? (
        notificationListElement
      ) : fetching ? (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      ) : (
        notificationListElement
      )}
    </Page>
  );
}
