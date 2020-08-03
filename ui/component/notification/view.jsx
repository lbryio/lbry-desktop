// @flow

import { NOTIFICATION_CREATOR_SUBSCRIBER, NOTIFICATION_COMMENT } from 'constants/notifications';
import * as ICONS from 'constants/icons';
import React from 'react';
import Icon from 'component/common/icon';
import DateTime from 'component/dateTime';
import ChannelThumbnail from 'component/channelThumbnail';
import { MenuItem } from '@reach/menu-button';
import { formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';

type Props = {
  notification: WebNotification,
  menuButton: boolean,
  children: any,
};

export default function Notification(props: Props) {
  const { notification, menuButton = false } = props;
  const { push } = useHistory();
  const notificationTarget = notification && notification.notification_parameters.device.target;
  let notificationLink = formatLbryUrlForWeb(notificationTarget);
  if (notification.notification_rule === NOTIFICATION_COMMENT && notification.notification_parameters.dynamic.hash) {
    notificationLink += `?lc=${notification.notification_parameters.dynamic.hash}`;
  }

  let icon;
  switch (notification.notification_rule) {
    case NOTIFICATION_CREATOR_SUBSCRIBER:
      icon = <Icon icon={ICONS.SUBSCRIBE} sectionIcon className="notification__icon" />;
      break;
    case NOTIFICATION_COMMENT:
      icon = <ChannelThumbnail small uri={notification.notification_parameters.dynamic.comment_author} />;
      break;
    default:
      icon = <Icon icon={ICONS.NOTIFICATION} sectionIcon className="notification__icon" />;
  }

  const Wrapper = menuButton
    ? (props: { children: any }) => (
        <MenuItem className="menu__link--notification" onSelect={() => push(notificationLink)}>
          {props.children}
        </MenuItem>
      )
    : (props: { children: any }) => (
        <a className="menu__link--notification" onClick={() => push(notificationLink)}>
          {props.children}
        </a>
      );

  return (
    <Wrapper>
      <div className="notification__wrapper">
        <div className="notification__icon">{icon}</div>
        <div className="notification__content">
          <div>
            {notification.notification_rule !== NOTIFICATION_COMMENT && (
              <div className="notification__title">{notification.notification_parameters.device.title}</div>
            )}

            <div className="notification__text">
              {notification.notification_parameters.device.text.replace(
                // This is terrible and will be replaced when I make the comment channel clickable
                'commented on',
                notification.group_count ? `left ${notification.group_count} comments on` : 'commented on'
              )}
            </div>
          </div>

          <div className="notification__time">
            <DateTime timeAgo date={notification.created_at} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
