// @flow
import React from 'react';
import classnames from 'classnames';
import { SIMPLE_SITE } from 'config';
type Props = {
  unseenCount: number,
  inline: boolean,
  user: ?User,
};

export default function NotificationHeaderButton(props: Props) {
  const { unseenCount, inline = false, user } = props;
  const notificationsEnabled = SIMPLE_SITE || (user && user.experimental_ui);

  if (unseenCount === 0 || !notificationsEnabled) {
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
          'notification__bubble--small': unseenCount > 9,
        })}
      >
        {unseenCount > 20 ? '20+' : unseenCount}
      </span>
    </span>
  );
}
