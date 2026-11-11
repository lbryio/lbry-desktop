import * as ICONS from "constants/icons";
import React from "react";
import Page from "component/page";
import Spinner from "component/spinner";
import { FormField } from "component/common/form";
import Notification from "component/notification";
import Button from "component/button";
import usePersistedState from "effects/use-persisted-state";
import Yrbl from "component/yrbl";
import * as NOTIFICATIONS from "constants/notifications";
import useFetched from "effects/use-fetched";
import { RULE } from "constants/notifications";

type Props = {
  notifications: Array<WebNotification>;
  notificationsFiltered: Array<WebNotification>;
  notificationCategories: Array<NotificationCategory>;
  fetching: boolean;
  unreadCount: number;
  unseenCount: number;
  doSeeAllNotifications: () => void;
  doReadNotifications: () => void;
  doNotificationList: (arg1?: Array<string> | null | undefined) => void;
  activeChannel: ChannelClaim | null | undefined;
  doCommentReactList: (arg1: Array<string>) => Promise<any>;
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
    activeChannel,
    doCommentReactList,
  } = props;
  const initialFetchDone = useFetched(fetching);
  const [name, setName] = usePersistedState("notifications--rule", NOTIFICATIONS.NOTIFICATION_NAME_ALL);
  const isFiltered = name !== NOTIFICATIONS.NOTIFICATION_NAME_ALL;
  const list = isFiltered ? notificationsFiltered : notifications;

  // Fetch reacts
  React.useEffect(() => {
    if ((!fetching || initialFetchDone) && activeChannel) {
      const idsForReactionFetch: unknown = [];
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
          // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
          idsForReactionFetch.push(commentId);
        }
      });

      // @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
      if (idsForReactionFetch.length !== 0) {
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string[]'.
        doCommentReactList(idsForReactionFetch);
      }
    }
  }, [doCommentReactList, list, activeChannel, fetching, initialFetchDone]);

  React.useEffect(() => {
    if (unseenCount > 0 || unreadCount > 0) {
      // If there are unread notifications when entering the page, reset to All.
      setName(NOTIFICATIONS.NOTIFICATION_NAME_ALL);
    }
  }, [setName, unreadCount, unseenCount]);

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
        } catch (e: any) {
          console.error(e);
        }
      }
    }
  }, [name, notifications, stringifiedNotificationCategories, doNotificationList]);

  const notificationListElement = (
    <>
      <div className="claim-list__header">
        <h1 className="card__title">{__("Notifications")}</h1>
        <div className="claim-list__alt-controls--wrap">
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          {fetching && <Spinner type="small" />}

          {unreadCount > 0 && (
            // @ts-expect-error - TS2322 (ts-migration)
            <Button icon={ICONS.EYE} onClick={doReadNotifications} button="secondary" label={__("Mark all as read")} />
          )}
          {notificationCategories && (
            <FormField
              // @ts-expect-error - TS2322 - Type '{ children: Element[]; className: string; type: string; name: string; value: any; onChange: (e: any) => any; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
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
            {list.map((notification) => {
              // @ts-expect-error - TS2741 (ts-migration)
              return <Notification key={notification.id} notification={notification} />;
            })}
          </div>
        </div>
      ) : (
        <div className="main--empty">
          {!fetching && (
            <Yrbl
              title={__("No notifications")}
              subtitle={
                isFiltered
                  ? __("Try selecting another filter.")
                  : __("You don't have any notifications yet, but they will be here when you do!")
              }
              actions={
                <div className="section__actions">
                  {/* @ts-expect-error - TS2322 (ts-migration) */}
                  <Button button="primary" icon={ICONS.HOME} label={__("Go Home")} navigate="/" />
                </div>
              }
            />
          )}
        </div>
      )}
    </>
  );

  return (
    // @ts-expect-error - TS2740 (ts-migration)
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
