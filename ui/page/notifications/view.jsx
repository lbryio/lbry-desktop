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

const RULE_LABELS = {
  [NOTIFICATIONS.NOTIFICATION_RULE_NONE]: 'All',
  [NOTIFICATIONS.NOTIFICATION_RULE_COMMENTS]: 'Comments',
  [NOTIFICATIONS.NOTIFICATION_RULE_REPLIES]: 'Replies',
  [NOTIFICATIONS.NOTIFICATION_RULE_FOLLOWERS]: 'Followers',
  [NOTIFICATIONS.NOTIFICATION_RULE_NEW_CONTENT]: 'New content',
  [NOTIFICATIONS.NOTIFICATION_RULE_OTHERS]: 'Others',
};

type Props = {
  notifications: Array<Notification>,
  notificationsFiltered: Array<Notification>,
  fetching: boolean,
  unreadCount: number,
  unseenCount: number,
  doSeeAllNotifications: () => void,
  doReadNotifications: () => void,
  doNotificationList: (string) => void,
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
  } = props;

  const initialFetchDone = useFetched(fetching);
  const [rule, setRule] = usePersistedState('notifications--rule', NOTIFICATIONS.NOTIFICATION_RULE_NONE);
  const isFiltered = rule !== NOTIFICATIONS.NOTIFICATION_RULE_NONE;
  const list = isFiltered ? notificationsFiltered : notifications;

  React.useEffect(() => {
    if (unseenCount > 0 || unreadCount > 0) {
      // If there are unread notifications when entering the page, reset to All.
      setRule(NOTIFICATIONS.NOTIFICATION_RULE_NONE);
    }
  }, []);

  React.useEffect(() => {
    if (unseenCount > 0) {
      doSeeAllNotifications();
    }
  }, [unseenCount, doSeeAllNotifications]);

  React.useEffect(() => {
    if (rule && rule !== '') {
      // Fetch filtered list when:
      // (1) 'rule' changed
      // (2) new "all" notifications received (e.g. from websocket).
      doNotificationList(rule);
    }
  }, [rule, notifications]);

  const notificationListElement = (
    <>
      <div className="claim-list__header">
        <h1 className="card__title">{__('Notifications')}</h1>
        <div className="claim-list__alt-controls--wrap">
          {fetching && <Spinner type="small" />}

          {unreadCount > 0 && (
            <Button icon={ICONS.EYE} onClick={doReadNotifications} button="secondary" label={__('Mark all as read')} />
          )}
          <FormField
            className="notification__filter"
            type="select"
            name="filter"
            value={rule}
            onChange={(e) => setRule(e.target.value)}
          >
            {Object.entries(RULE_LABELS).map((r) => {
              return (
                <option key={r[0]} value={r[0]}>
                  {__(String(r[1]))}
                </option>
              );
            })}
          </FormField>
        </div>
      </div>
      {list && list.length > 0 ? (
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
