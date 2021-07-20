// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import Icon from 'component/common/icon';
import NotificationBubble from 'component/notificationBubble';
import Button from 'component/button';
import { useHistory } from 'react-router';

type Props = {
  unseenCount: number,
  doSeeAllNotifications: () => void,
  user: ?User,
};

export default function NotificationHeaderButton(props: Props) {
  const {
    unseenCount,
    // notifications,
    // fetching,
    doSeeAllNotifications,
    // user,
  } = props;
  const { push } = useHistory();

  function handleMenuClick() {
    if (unseenCount > 0) {
      doSeeAllNotifications();
    }

    push(`/$/${PAGES.NOTIFICATIONS}`);
  }

  return (
    <Button
      onClick={handleMenuClick}
      aria-label={__('Notifications')}
      title={__('Notifications')}
      className="header__navigation-item menu__title header__navigation-item--icon mobile-hidden"
    >
      <Icon size={18} icon={ICONS.NOTIFICATION} aria-hidden />
      <NotificationBubble />
    </Button>
  );
}
