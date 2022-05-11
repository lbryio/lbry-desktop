// @flow
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
  unseenLocalCount: number,
  doLbryioSeeAllNotifications: () => void,
  doLocalSeeAllNotifications: () => void,
};

export default function NotificationHeaderButton(props: Props) {
  const { unseenCount, unseenLocalCount, doLbryioSeeAllNotifications, doLocalSeeAllNotifications } = props;

  const { push } = useHistory();

  function handleMenuClick() {
    if (unseenCount > 0) doLbryioSeeAllNotifications();
    if (unseenLocalCount > 0) doLocalSeeAllNotifications();
    push(`/$/${PAGES.NOTIFICATIONS}`);
  }

  return (
    <Tooltip title={__('Notifications')}>
      <Button onClick={handleMenuClick} className="header__navigationItem--icon">
        <Icon size={18} icon={ICONS.NOTIFICATION} aria-hidden />
        <NotificationBubble />
      </Button>
    </Tooltip>
  );
}
