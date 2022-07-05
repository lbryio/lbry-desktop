// @flow
import 'scss/component/_header.scss';

import { ENABLE_UI_NOTIFICATIONS } from 'config';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Icon from 'component/common/icon';
import NotificationBubble from 'component/notificationBubble';
import React from 'react';
import Tooltip from 'component/common/tooltip';
import Notification from 'component/notification';
import DateTime from 'component/dateTime';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu as MuiMenu } from '@mui/material';
import Button from 'component/button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { RULE } from 'constants/notifications';
import UriIndicator from 'component/uriIndicator';
import { getNotificationLink } from '../notification/helpers/target';
import { generateNotificationTitle } from '../notification/helpers/title';
import { generateNotificationText } from '../notification/helpers/text';
import { parseURI } from 'util/lbryURI';
import { NavLink } from 'react-router-dom';

type Props = {
  notifications: Array<Notification>,
  unseenCount: number,
  user: ?User,
  authenticated: boolean,
  readNotification: (Array<number>) => void,
  seeNotification: (Array<number>) => void,
  deleteNotification: (number) => void,
  doSeeAllNotifications: () => void,
};

export default function NotificationHeaderButton(props: Props) {
  const {
    notifications,
    unseenCount,
    user,
    authenticated,
    readNotification,
    seeNotification,
    deleteNotification,
    doSeeAllNotifications,
  } = props;
  const list = notifications.slice(0, 20);
  const { push } = useHistory();
  const notificationsEnabled = authenticated && (ENABLE_UI_NOTIFICATIONS || (user && user.experimental_ui));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [clicked, setClicked] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    doSeeAllNotifications();
    if (unseenCount > 0) doSeeAllNotifications();
    setAnchorEl(!anchorEl ? event.currentTarget : null);
  };
  const handleClose = () => setAnchorEl(null);

  const menuProps = {
    id: 'notification-menu',
    anchorEl,
    open,
    onClose: handleClose,
    MenuListProps: {
      'aria-labelledby': 'basic-button',
      sx: { padding: 'var(--spacing-xs)' },
    },
    className: 'menu__list--header menu__list--notifications',
    sx: { 'z-index': 2 },
    PaperProps: { className: 'MuiMenu-list--paper' },
    disableScrollLock: true,
  };

  const handleClickAway = () => {
    if (!clicked) {
      if (open) setClicked(true);
    } else {
      setAnchorEl(null);
      setClicked(false);
    }
  };

  const creatorIcon = (channelUrl, channelThumbnail) => (
    <UriIndicator uri={channelUrl} link showAtSign channelInfo={{ uri: channelUrl, name: '' }}>
      <ChannelThumbnail small thumbnailPreview={channelThumbnail} uri={channelThumbnail ? undefined : channelUrl} />
    </UriIndicator>
  );

  function handleMenuClick() {
    push(`/$/${PAGES.NOTIFICATIONS}`);
  }

  function handleNotificationDelete(e, id) {
    e.stopPropagation();
    e.preventDefault();
    deleteNotification(id);
  }

  React.useEffect(() => {
    if (!open) setClicked(false);
  }, [open]);

  if (!notificationsEnabled) return null;

  function handleNotificationClick(notification) {
    const { id, is_read } = notification;

    if (!is_read) {
      seeNotification([id]);
      readNotification([id]);
    }

    push(getNotificationLink(notification));
  }

  function getWebUri(notification) {
    return getNotificationLink(notification);
  }

  function menuEntry(notification) {
    const { id, active_at, notification_rule, notification_parameters, is_read, type } = notification;

    let channelUrl;
    let icon;
    switch (notification_rule) {
      case RULE.CREATOR_SUBSCRIBER:
        icon = <Icon icon={ICONS.SUBSCRIBE} sectionIcon />;
        break;
      case RULE.COMMENT:
      case RULE.CREATOR_COMMENT:
        channelUrl = notification_parameters.dynamic.comment_author;
        icon = creatorIcon(channelUrl, notification_parameters?.dynamic?.comment_author_thumbnail);
        break;
      case RULE.COMMENT_REPLY:
        channelUrl = notification_parameters.dynamic.reply_author;
        icon = creatorIcon(channelUrl, notification_parameters?.dynamic?.comment_author_thumbnail);
        break;
      case RULE.NEW_CONTENT:
        channelUrl = notification_parameters.dynamic.channel_url;
        icon = creatorIcon(channelUrl, notification_parameters?.dynamic?.channel_thumbnail);
        break;
      case RULE.NEW_LIVESTREAM:
        channelUrl = notification_parameters.dynamic.channel_url;
        icon = creatorIcon(channelUrl, notification_parameters?.dynamic?.channel_thumbnail);
        break;
      case RULE.WEEKLY_WATCH_REMINDER:
      case RULE.DAILY_WATCH_AVAILABLE:
      case RULE.DAILY_WATCH_REMIND:
      case RULE.MISSED_OUT:
      case RULE.REWARDS_APPROVAL_PROMPT:
        icon = <Icon icon={ICONS.LBC} sectionIcon />;
        break;
      case RULE.FIAT_TIP:
        icon = <Icon icon={ICONS.FINANCE} sectionIcon />;
        break;
      default:
        icon = <Icon icon={ICONS.NOTIFICATION} sectionIcon />;
    }

    let channelName;
    if (channelUrl) {
      try {
        ({ claimName: channelName } = parseURI(channelUrl));
      } catch (e) {}
    }

    return (
      <NavLink onClick={() => handleNotificationClick(notification)} key={id} to={getWebUri(notification)}>
        <div
          className={is_read ? 'menu__list--notification' : 'menu__list--notification menu__list--notification-unread'}
          key={id}
        >
          <div className="notification__icon">{icon}</div>
          <div className="menu__list--notification-info">
            <div className="menu__list--notification-type">
              {generateNotificationTitle(notification_rule, notification_parameters, channelName)}
            </div>
            <div
              className={
                type === 'comments' ? 'menu__list--notification-title blockquote' : 'menu__list--notification-title'
              }
            >
              {generateNotificationText(notification_rule, notification_parameters)}
            </div>
            {!is_read && <span className="dot">•</span>}
            <DateTime timeAgo date={active_at} />
          </div>
          <div className="delete-notification" onClick={(e) => handleNotificationDelete(e, id)}>
            <Icon icon={ICONS.DELETE} sectionIcon />
          </div>
        </div>
      </NavLink>
    );
  }

  return (
    notificationsEnabled && (
      <>
        <Tooltip title={__('Notifications')}>
          <Button className="header__navigationItem--icon" onClick={handleClick}>
            <Icon size={18} icon={ICONS.NOTIFICATION} aria-hidden />
            <NotificationBubble />
          </Button>
        </Tooltip>

        <ClickAwayListener onClickAway={handleClickAway}>
          <MuiMenu {...menuProps}>
            <div className="menu__list--notifications-header" />
            <div className="menu__list--notifications-list">
              {list.map((notification) => {
                return menuEntry(notification);
              })}
              {list.length === 0 && (
                <div className="menu__list--notification-empty">
                  <div className="menu__list--notification-empty-title">{__('No notifications')}</div>
                  <div className="menu__list--notification-empty-text">
                    {__("You don't have any notifications yet, but they will be here when you do!")}
                  </div>
                </div>
              )}
            </div>

            <NavLink onClick={handleMenuClick} to={`/$/${PAGES.NOTIFICATIONS}`}>
              <div className="menu__list--notifications-more">{__('View all')}</div>
            </NavLink>
          </MuiMenu>
        </ClickAwayListener>
      </>
    )
  );
}
