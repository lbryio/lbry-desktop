// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';
import Notification from 'component/notification';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';
import Yrbl from 'component/yrbl';
import * as NOTIFICATIONS from 'constants/notifications';
import classnames from 'classnames';

type Props = {
  notifications: Array<Notification>,
  fetching: boolean,
  unreadCount: number,
  unseenCount: number,
  doSeeAllNotifications: () => void,
  doReadNotifications: () => void,
};

const ALL_NOTIFICATIONS = 'all';

export default function NotificationsPage(props: Props) {
  const { notifications, fetching, unreadCount, unseenCount, doSeeAllNotifications, doReadNotifications } = props;
  const hasNotifications = notifications.length > 0;
  const [filterBy, setFilterBy] = usePersistedState('notifications--filter-by', 'all');
  const [filteredNotifications, setFilteredNotifications] = React.useState(notifications);
  const isFiltered = filterBy !== ALL_NOTIFICATIONS;

  const NOTIFICATION_FILTER_TYPES = [
    ALL_NOTIFICATIONS,
    NOTIFICATIONS.NOTIFICATION_CREATOR_SUBSCRIBER,
    NOTIFICATIONS.NOTIFICATION_COMMENT,
    NOTIFICATIONS.NOTIFICATION_REPLY,
    NOTIFICATIONS.DAILY_WATCH_AVAILABLE,
    NOTIFICATIONS.DAILY_WATCH_REMIND,
    NOTIFICATIONS.NEW_CONTENT,
  ];

  React.useEffect(() => {
    if (unseenCount > 0 || unreadCount > 0) {
      // If there are unread notifications when entering the page, reset to All.
      setFilterBy(ALL_NOTIFICATIONS);
    }
  }, []);

  React.useEffect(() => {
    if (notifications && filterBy !== ALL_NOTIFICATIONS) {
      setFilteredNotifications(notifications.filter((n) => n.notification_rule === filterBy));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [notifications, filterBy]);

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
          <div className="claim-list__header">
            <h1 className="card__title">{__('Notifications')}</h1>
            <div className="claim-list__alt-controls--wrap">
              {fetching && <Spinner type="small" />}
              <div className={'claim-search__input-container'}>
                <FormField
                  className={classnames('claim-search__dropdown', {
                    'claim-search__dropdown--selected': filterBy,
                  })}
                  type="select"
                  name="filter"
                  value={filterBy || ALL_NOTIFICATIONS}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  {NOTIFICATION_FILTER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {/* i18fixme */}
                      {type === ALL_NOTIFICATIONS && __('All')}
                      {type === NOTIFICATIONS.NOTIFICATION_CREATOR_SUBSCRIBER && __('Followers')}
                      {type === NOTIFICATIONS.NOTIFICATION_COMMENT && __('Comments')}
                      {type === NOTIFICATIONS.NOTIFICATION_REPLY && __('Comment replies')}
                      {type === NOTIFICATIONS.DAILY_WATCH_AVAILABLE && __('Daily watch availability')}
                      {type === NOTIFICATIONS.DAILY_WATCH_REMIND && __('Daily watch reminders')}
                      {type === NOTIFICATIONS.NEW_CONTENT && __('New content')}
                    </option>
                  ))}
                </FormField>
              </div>
              {unreadCount > 0 && (
                <Button
                  icon={ICONS.EYE}
                  onClick={doReadNotifications}
                  button="secondary"
                  label={__('Mark all as read')}
                />
              )}
            </div>
          </div>
          <Card
            isBodyList
            body={
              <>
                {filteredNotifications && filteredNotifications.length > 0 ? (
                  <div className="notification_list">
                    {filteredNotifications.map((notification, index) => {
                      return <Notification key={notification.id} notification={notification} />;
                    })}
                  </div>
                ) : (
                  <div className="main--empty">
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
                  </div>
                )}
              </>
            }
          />
        </>
      )}
    </Page>
  );
}
