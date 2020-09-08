// @flow

import { NOTIFICATION_CREATOR_SUBSCRIBER, NOTIFICATION_COMMENT, NOTIFICATION_REPLY } from 'constants/notifications';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import { MenuItem } from '@reach/menu-button';
import { formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';
import { parseURI } from 'lbry-redux';
import { PAGE_VIEW_QUERY, DISCUSSION_PAGE } from 'page/channel/view';

type Props = {
  notification: WebNotification,
  menuButton: boolean,
  children: any,
  doSeeNotifications: ([number]) => void,
};

export default function Notification(props: Props) {
  const { notification, menuButton = false, doSeeNotifications } = props;
  const { push } = useHistory();
  const { notification_rule, notification_parameters, is_seen, id } = notification;
  const notificationTarget = notification && notification_parameters.device.target;
  const isCommentNotification = notification_rule === NOTIFICATION_COMMENT || notification_rule === NOTIFICATION_REPLY;
  const commentText = isCommentNotification && notification_parameters.dynamic.comment;
  let notificationLink = formatLbryUrlForWeb(notificationTarget);
  let urlParams = new URLSearchParams();
  if (isCommentNotification && notification_parameters.dynamic.hash) {
    urlParams.append('lc', notification_parameters.dynamic.hash);
  }

  try {
    const { isChannel } = parseURI(notificationTarget);
    if (isChannel) {
      urlParams.append(PAGE_VIEW_QUERY, DISCUSSION_PAGE);
    }
  } catch (e) {}

  notificationLink += `?${urlParams.toString()}`;

  let icon;
  switch (notification_rule) {
    case NOTIFICATION_CREATOR_SUBSCRIBER:
      icon = <Icon icon={ICONS.SUBSCRIBE} sectionIcon className="notification__icon" />;
      break;
    case NOTIFICATION_COMMENT:
      icon = <ChannelThumbnail small uri={notification_parameters.dynamic.comment_author} />;
      break;
    case NOTIFICATION_REPLY:
      icon = <ChannelThumbnail small uri={notification_parameters.dynamic.reply_author} />;
      break;
    default:
      icon = <Icon icon={ICONS.NOTIFICATION} sectionIcon className="notification__icon" />;
  }

  function handleNotificationClick() {
    if (!is_seen) {
      doSeeNotifications([id]);
    }

    if (notificationLink) {
      push(notificationLink);
    }
  }

  function handleSeeNotification(e) {
    e.stopPropagation();
    doSeeNotifications([id]);
  }

  const Wrapper = menuButton
    ? (props: { children: any }) => (
        <MenuItem className="menu__link--notification" onSelect={handleNotificationClick}>
          {props.children}
        </MenuItem>
      )
    : notificationLink
    ? (props: { children: any }) => (
        <a className="menu__link--notification" onClick={handleNotificationClick}>
          {props.children}
        </a>
      )
    : (props: { children: any }) => (
        <span
          className={is_seen ? 'menu__link--notification-nolink' : 'menu__link--notification'}
          onClick={handleNotificationClick}
        >
          {props.children}
        </span>
      );

  return (
    <Wrapper>
      <div
        className={classnames('notification__wrapper', {
          'notification__wrapper--unseen': !is_seen,
        })}
      >
        <div className="notification__icon">{icon}</div>
        <div className="notification__content">
          <div>
            {!isCommentNotification && (
              <div className="notification__title">{notification_parameters.device.title}</div>
            )}

            {isCommentNotification && commentText ? (
              <>
                <div className="notification__title">{notification_parameters.device.title}</div>
                <div className="notification__text mobile-hidden">{commentText}</div>
              </>
            ) : (
              <>
                <div className="notification__text">{notification_parameters.device.text}</div>
              </>
            )}
          </div>

          <div className="notification__extra">
            <div className="notification__time">
              <DateTime timeAgo date={notification.created_at} />
            </div>
            {!is_seen && <Button className="notification__mark-seen" onClick={handleSeeNotification} />}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
