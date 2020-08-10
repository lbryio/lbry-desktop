// @flow
import React from 'react';

type Props = {
  unreadCount: number,
};

export default function NotificationHeaderButton(props: Props) {
  const { unreadCount } = props;

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className="notification__bubble">
      <span className="notification__count">{unreadCount}</span>
    </span>
  );
}
