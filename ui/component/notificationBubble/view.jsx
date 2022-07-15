// @flow
import React from 'react';
import classnames from 'classnames';
import { ENABLE_UI_NOTIFICATIONS } from 'config';
import { buildUnseenCountStr } from 'util/notifications';

type Props = {
  unseenCount: number,
  inline: boolean,
  user: ?User,
};

export default function NotificationBubble(props: Props) {
  const { unseenCount, inline = false, user } = props;
  const notificationsEnabled = ENABLE_UI_NOTIFICATIONS || (user && user.experimental_ui);

  if (!notificationsEnabled) {
    return null;
  }

  return (
    <span
      className={classnames('notification__bubble', {
        'notification__bubble--inline': inline,
        'notification__bubble-hidden': unseenCount === 0,
      })}
    >
      <span
        className={classnames('notification__count', {
          'notification__bubble--small': unseenCount > 9,
        })}
      >
        {buildUnseenCountStr(unseenCount)}
      </span>
    </span>
  );
}
