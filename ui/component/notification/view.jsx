// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import { RULE } from 'constants/notifications';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import { formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';
import { parseURI } from 'util/lbryURI';
import { PAGE_VIEW_QUERY, DISCUSSION_PAGE } from 'page/channel/view';
import FileThumbnail from 'component/fileThumbnail';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import NotificationContentChannelMenu from 'component/notificationContentChannelMenu';
import LbcMessage from 'component/common/lbc-message';
import UriIndicator from 'component/uriIndicator';
import { NavLink } from 'react-router-dom';
import CommentReactions from 'component/commentReactions';
import CommentCreate from 'component/commentCreate';
import CommentsReplies from 'component/commentsReplies';

type Props = {
  notification: WebNotification,
  menuButton: boolean,
  children: any,
  doReadNotifications: ([number]) => void,
  doDeleteNotification: (number) => void,
};

export default function Notification(props: Props) {
  const { notification, menuButton = false, doReadNotifications, doDeleteNotification } = props;
  const { push } = useHistory();
  const { notification_rule, notification_parameters, is_read, id } = notification;
  const [isReplying, setReplying] = React.useState(false);
  const [quickReply, setQuickReply] = React.useState();

  const isIgnoredNotification = notification_rule === RULE.NEW_LIVESTREAM;
  if (isIgnoredNotification) {
    return null;
  }
  const isCommentNotification =
    notification_rule === RULE.COMMENT ||
    notification_rule === RULE.COMMENT_REPLY ||
    notification_rule === RULE.CREATOR_COMMENT;
  const commentText = isCommentNotification && notification_parameters.dynamic.comment;

  let notificationTarget;
  switch (notification_rule) {
    case RULE.DAILY_WATCH_AVAILABLE:
    case RULE.DAILY_WATCH_REMIND:
      notificationTarget = `/$/${PAGES.CHANNELS_FOLLOWING}`;
      break;
    case RULE.MISSED_OUT:
    case RULE.REWARDS_APPROVAL_PROMPT:
      notificationTarget = `/$/${PAGES.REWARDS_VERIFY}?redirect=/$/${PAGES.REWARDS}`;
      break;
    default:
      notificationTarget = notification_parameters.device.target;
  }

  const creatorIcon = (channelUrl) => {
    return (
      <UriIndicator uri={channelUrl} link>
        <ChannelThumbnail small uri={channelUrl} />
      </UriIndicator>
    );
  };
  let channelUrl;
  let icon;
  switch (notification_rule) {
    case RULE.CREATOR_SUBSCRIBER:
      icon = <Icon icon={ICONS.SUBSCRIBE} sectionIcon />;
      break;
    case RULE.COMMENT:
    case RULE.CREATOR_COMMENT:
      channelUrl = notification_parameters.dynamic.comment_author;
      icon = creatorIcon(channelUrl);
      break;
    case RULE.COMMENT_REPLY:
      channelUrl = notification_parameters.dynamic.reply_author;
      icon = creatorIcon(channelUrl);
      break;
    case RULE.NEW_CONTENT:
      channelUrl = notification_parameters.dynamic.channel_url;
      icon = creatorIcon(channelUrl);
      break;
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

  let notificationLink = formatLbryUrlForWeb(notificationTarget);
  let urlParams = new URLSearchParams();
  if (isCommentNotification && notification_parameters.dynamic.hash) {
    urlParams.append('lc', notification_parameters.dynamic.hash);
  }

  let channelName;
  if (channelUrl) {
    try {
      const { claimName } = parseURI(channelUrl);
      channelName = claimName;
    } catch (e) {}
  }

  const notificationTitle = notification_parameters.device.title;
  const titleSplit = notificationTitle.split(' ');
  let fullTitle = [' '];
  let uriIndicator;
  const title = titleSplit.map((message, index) => {
    if (channelName === message) {
      uriIndicator = <UriIndicator uri={channelUrl} link />;
      fullTitle.push(' ');
      const resultTitle = fullTitle;
      fullTitle = [' '];

      return [resultTitle.join(' '), uriIndicator];
    } else {
      fullTitle.push(message);

      if (index === titleSplit.length - 1) {
        const result = fullTitle.join(' ');
        return <LbcMessage key={result}>{result}</LbcMessage>;
      }
    }
  });

  try {
    const { isChannel } = parseURI(notificationTarget);
    if (isChannel) {
      urlParams.append(PAGE_VIEW_QUERY, DISCUSSION_PAGE);
    }
  } catch (e) {}

  notificationLink += `?${urlParams.toString()}`;
  const navLinkProps = {
    to: notificationLink,
    onClick: (e) => e.stopPropagation(),
  };

  function handleNotificationClick() {
    if (!is_read) {
      doReadNotifications([id]);
    }

    if (menuButton && notificationLink) {
      push(notificationLink);
    }
  }

  const Wrapper = menuButton
    ? (props: { children: any }) => (
        <MenuItem className="menu__link--notification" onSelect={handleNotificationClick}>
          {props.children}
        </MenuItem>
      )
    : notificationLink
    ? (props: { children: any }) => (
        <NavLink {...navLinkProps} className="menu__link--notification" onClick={handleNotificationClick}>
          {props.children}
        </NavLink>
      )
    : (props: { children: any }) => (
        <span
          className={is_read ? 'menu__link--notification-nolink' : 'menu__link--notification'}
          onClick={handleNotificationClick}
        >
          {props.children}
        </span>
      );

  return (
    <div
      className={classnames('notification__wrapper', {
        'notification__wrapper--unread': !is_read,
      })}
    >
      <Wrapper>
        <div className="notification__icon">{icon}</div>

        <div className="notification__content-wrapper">
          <div className="notification__content">
            <div className="notification__text-wrapper">
              {!isCommentNotification && <div className="notification__title">{title}</div>}

              {isCommentNotification && commentText ? (
                <>
                  <div className="notification__title">{title}</div>
                  <div title={commentText} className="notification__text">
                    {commentText}
                  </div>
                </>
              ) : (
                <>
                  <div
                    title={notification_parameters.device.text.replace(/\sLBC/g, ' Credits')}
                    className="notification__text"
                  >
                    <LbcMessage>{notification_parameters.device.text}</LbcMessage>
                  </div>
                </>
              )}
            </div>

            {notification_rule === RULE.NEW_CONTENT && (
              <FileThumbnail uri={notification_parameters.device.target} className="notification__content-thumbnail" />
            )}
            {notification_rule === RULE.NEW_LIVESTREAM && (
              <FileThumbnail
                thumbnail={notification_parameters.device.image_url}
                className="notification__content-thumbnail"
              />
            )}
          </div>

          <div className="notification__extra">
            {!is_read && (
              <Button
                className="notification__mark-seen"
                onClick={(e) => {
                  e.stopPropagation();
                  doReadNotifications([id]);
                }}
              />
            )}
            <div className="notification__time">
              <DateTime timeAgo date={notification.active_at} />
            </div>
          </div>
        </div>

        <div className="notification__menu">
          <Menu>
            <MenuButton
              className={'menu__button notification__menu-button'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Icon size={18} icon={ICONS.MORE_VERTICAL} />
            </MenuButton>
            <MenuList className="menu__list">
              <MenuItem className="menu__link" onSelect={() => doDeleteNotification(id)}>
                <Icon aria-hidden icon={ICONS.DELETE} />
                {__('Delete')}
              </MenuItem>
              {notification_rule === RULE.NEW_CONTENT && channelUrl ? (
                <NotificationContentChannelMenu uri={channelUrl} />
              ) : null}
            </MenuList>
          </Menu>
        </div>
      </Wrapper>

      {isCommentNotification && (
        <div>
          <div className="notification__reactions">
            <Button
              label={__('Reply')}
              className="comment__action"
              onClick={() => setReplying(!isReplying)}
              icon={ICONS.REPLY}
            />
            <CommentReactions
              uri={notificationTarget}
              commentId={notification_parameters.dynamic.hash}
              hideCreatorLike
            />
          </div>

          {isReplying && (
            <CommentCreate
              isReply
              uri={notificationTarget}
              parentId={notification_parameters.dynamic.hash}
              onDoneReplying={() => setReplying(false)}
              onCancelReplying={() => setReplying(false)}
              setQuickReply={setQuickReply}
              supportDisabled
              shouldFetchComment
            />
          )}

          {quickReply && (
            <CommentsReplies
              uri={notificationTarget}
              parentId={notification_parameters.dynamic.hash}
              numDirectReplies={1}
              supportDisabled
            />
          )}
        </div>
      )}
    </div>
  );
}
