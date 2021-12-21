// @flow
import 'scss/component/_header.scss';

import { ENABLE_UI_NOTIFICATIONS } from 'config';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import Icon from 'component/common/icon';
import NotificationBubble from 'component/notificationBubble';
import React from 'react';
import Tooltip from 'component/common/tooltip';

type Props = {
  unseenCount: number,
  user: ?User,
  doSeeAllNotifications: () => void,
};

export default function NotificationHeaderButton(props: Props) {
  const { unseenCount, user, doSeeAllNotifications } = props;

  const { push } = useHistory();
  const notificationsEnabled = ENABLE_UI_NOTIFICATIONS || (user && user.experimental_ui);

  function handleMenuClick() {
    if (unseenCount > 0) doSeeAllNotifications();
    push(`/$/${PAGES.NOTIFICATIONS}`);
  }

  if (!notificationsEnabled) return null;

  return (
    <Tooltip title={__('Notifications')}>
      <Button onClick={handleMenuClick} className="header__navigationItem--icon">
        <Icon size={18} icon={ICONS.NOTIFICATION} aria-hidden />
        <NotificationBubble />
      </Button>
    </Tooltip>
  );
}
