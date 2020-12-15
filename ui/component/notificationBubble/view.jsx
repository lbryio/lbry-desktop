// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  unreadCount: number,
  inline: boolean,
};

export default function NotificationHeaderButton(props: Props) {
  const { unreadCount, inline = false } = props;

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span
      className={classnames('notification__bubble', {
        'notification__bubble--inline': inline,
      })}
    >
      <span
        className={classnames('notification__count', {
          'notification__bubble--small': unreadCount > 9,
        })}
      >
        {unreadCount > 20 ? '20+' : unreadCount}
      </span>
    </span>
  );
}
