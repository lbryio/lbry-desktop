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
import { RULE } from 'constants/notifications';
import BrowserNotificationBanner from '$web/component/browserNotificationBanner';

type Props = {
  notifications: Array<Notification>,
  notificationsFiltered: Array<Notification>,
  notificationCategories: Array<NotificationCategory>,
  fetching: boolean,
  unreadCount: number,
  unseenCount: number,
  doSeeAllNotifications: () => void,
  doReadNotifications: () => void,
  doNotificationList: (?Array<string>, ?boolean) => void,
  doNotificationCategories: () => void,
  activeChannel: ?ChannelClaim,
  doCommentReactList: (Array<string>) => Promise<any>,
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
    doNotificationCategories,
    notificationCategories,
    activeChannel,
    doCommentReactList,
  } = props;
  const [name, setName] = usePersistedState('notifications--rule', NOTIFICATIONS.NOTIFICATION_NAME_ALL);
  const isFiltered = name !== NOTIFICATIONS.NOTIFICATION_NAME_ALL;
  const list = isFiltered ? notificationsFiltered : notifications;

  const fetchedOnce = useFetched(fetching);
  const categoriesReady = notificationCategories;
  const notificationsReady = !isFiltered || fetchedOnce;
  const ready = categoriesReady && notificationsReady;

  // Fetch reacts
  React.useEffect(() => {
    if (ready && !fetching && activeChannel) {
      let idsForReactionFetch = [];
      list.map((notification) => {
        const { notification_rule, notification_parameters } = notification;
        const isComment =
          notification_rule === RULE.COMMENT ||
          notification_rule === RULE.COMMENT_REPLY ||
          notification_rule === RULE.CREATOR_COMMENT;
        const commentId =
          isComment &&
          notification_parameters &&
          notification_parameters.dynamic &&
          notification_parameters.dynamic.hash;

        if (commentId) {
          idsForReactionFetch.push(commentId);
        }
      });

      if (idsForReactionFetch.length !== 0) {
        doCommentReactList(idsForReactionFetch);
      }
    }
  }, [ready, doCommentReactList, list, activeChannel, fetching]);

  // Mark all as seen
  React.useEffect(() => {
    if (unseenCount > 0) {
      doSeeAllNotifications();
    }
  }, [unseenCount, doSeeAllNotifications]);

  const stringifiedNotificationCategories = notificationCategories ? JSON.stringify(notificationCategories) : '';

  // Fetch filtered notifications
  React.useEffect(() => {
    if (stringifiedNotificationCategories) {
      const arrayNotificationCategories = JSON.parse(stringifiedNotificationCategories);

      if (name !== NOTIFICATIONS.NOTIFICATION_NAME_ALL) {
        try {
          const matchingCategory = arrayNotificationCategories.find((category) => category.name === name);
          if (matchingCategory) {
            doNotificationList(matchingCategory.types, false);
          }
        } catch (e) {
          console.error(e); // eslint-disable-line no-console
        }
      }
    }
  }, [name, notifications, stringifiedNotificationCategories, doNotificationList]);

  React.useEffect(() => {
    if (!notificationCategories) {
      doNotificationCategories();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page className="notification-page">
      <BrowserNotificationBanner />

      {ready && (
        <div className="claim-list__header">
          <h1 className="card__title">{__('Notifications')}</h1>
          <div className="claim-list__alt-controls--wrap">
            {fetching && <Spinner type="small" delayed />}

            {unreadCount > 0 && (
              <Button
                icon={ICONS.EYE}
                onClick={doReadNotifications}
                button="secondary"
                label={__('Mark all as read')}
              />
            )}

            {notificationCategories && (
              <FormField type="select" name="filter" value={name} onChange={(e) => setName(e.target.value)}>
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
      )}

      {!ready ? (
        <div className="main--empty">
          <Spinner />
        </div>
      ) : list && list.length > 0 && !(isFiltered && fetching) ? (
        <div className="card">
          <div className="notification_list">
            {list.map((notification) => {
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
                isFiltered
                  ? __('Try selecting another filter.')
                  : __("You don't have any notifications yet, but they will be here when you do!")
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
    </Page>
  );
}
