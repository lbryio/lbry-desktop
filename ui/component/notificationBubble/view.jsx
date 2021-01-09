// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  unreadCount: number,
  inline: boolean,
  user: ?User,
};

export default function NotificationHeaderButton(props: Props) {
  const { unreadCount, inline = false, user } = props;
  const notificationsEnabled = user && user.experimental_ui;

  if (unreadCount === 0 || !notificationsEnabled) {
    return null;
  }

  return (
    <span
      className={classnames('notification__bubble', {
        'notification__bubble--inline': inline,
      })}
    >
      <span className="notification__count">{unreadCount > 20 ? '20+' : unreadCount}</span>
    </span>
  );
}
