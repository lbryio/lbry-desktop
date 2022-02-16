// @flow
import { lazyImport } from 'util/lazyImport';
import { formatLbryUrlForWeb } from 'util/url';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import { NavLink } from 'react-router-dom';
import { PAGE_VIEW_QUERY, DISCUSSION_PAGE } from 'page/channel/view';
import { parseSticker } from 'util/comments';
import { parseURI } from 'util/lbryURI';
import { RULE } from 'constants/notifications';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import DateTime from 'component/dateTime';
import FileThumbnail from 'component/fileThumbnail';
import Icon from 'component/common/icon';
import LbcMessage from 'component/common/lbc-message';
import NotificationContentChannelMenu from 'component/notificationContentChannelMenu';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';
import UriIndicator from 'component/uriIndicator';

const CommentCreate = lazyImport(() => import('component/commentCreate' /* webpackChunkName: "comments" */));
const CommentReactions = lazyImport(() => import('component/commentReactions' /* webpackChunkName: "comments" */));
const CommentsReplies = lazyImport(() => import('component/commentsReplies' /* webpackChunkName: "comments" */));

type Props = {
  menuButton: boolean,
  notification: WebNotification,
  deleteNotification: () => void,
  readNotification: () => void,
};

export default function Notification(props: Props) {
  const { menuButton = false, notification, readNotification, deleteNotification } = props;

  const { notification_rule, notification_parameters, is_read } = notification;

  const { push } = useHistory();
  const [isReplying, setReplying] = React.useState(false);
  const [quickReply, setQuickReply] = React.useState();

  const isCommentNotification =
    notification_rule === RULE.COMMENT ||
    notification_rule === RULE.COMMENT_REPLY ||
    notification_rule === RULE.CREATOR_COMMENT;
  const commentText = isCommentNotification && notification_parameters.dynamic.comment;
  const stickerFromComment = isCommentNotification && commentText && parseSticker(commentText);
  const notificationTarget = getNotificationTarget();

  const creatorIcon = (channelUrl, channelThumbnail) => (
    <UriIndicator uri={channelUrl} link channelInfo={{ uri: channelUrl, name: '' }}>
      <ChannelThumbnail small thumbnailPreview={channelThumbnail} uri={channelThumbnail ? undefined : channelUrl} />
    </UriIndicator>
  );

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

  let notificationLink = formatLbryUrlForWeb(notificationTarget);
  let urlParams = new URLSearchParams();
  if (isCommentNotification && notification_parameters.dynamic.hash) {
    urlParams.append('lc', notification_parameters.dynamic.hash);
  }

  let channelName;
  if (channelUrl) {
    try {
      ({ claimName: channelName } = parseURI(channelUrl));
    } catch (e) {}
  }

  const notificationTitle = notification_parameters.device.title;
  const titleSplit = notificationTitle.split(' ');
  let fullTitle = [' '];
  let uriIndicator;
  const title = titleSplit.map((message, index) => {
    if (channelName === message) {
      uriIndicator = (
        <UriIndicator key={channelUrl} uri={channelUrl} link channelInfo={{ uri: channelUrl, name: channelName }} />
      );
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
    if (isChannel) urlParams.append(PAGE_VIEW_QUERY, DISCUSSION_PAGE);
  } catch (e) {}

  notificationLink += `?${urlParams.toString()}`;
  const navLinkProps = { to: notificationLink, onClick: (e) => e.stopPropagation() };

  function getNotificationTarget() {
    switch (notification_rule) {
      case RULE.WEEKLY_WATCH_REMINDER:
      case RULE.DAILY_WATCH_AVAILABLE:
      case RULE.DAILY_WATCH_REMIND:
        return `/$/${PAGES.CHANNELS_FOLLOWING}`;
      case RULE.MISSED_OUT:
      case RULE.REWARDS_APPROVAL_PROMPT:
        return `/$/${PAGES.REWARDS_VERIFY}?redirect=/$/${PAGES.REWARDS}`;
      default:
        return notification_parameters.device.target;
    }
  }

  function handleNotificationClick() {
    if (!is_read) readNotification();
    if (menuButton && notificationLink) push(notificationLink);
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
    <div className={classnames('notification__wrapper', { 'notification__wrapper--unread': !is_read })}>
      <Wrapper>
        <div className="notification__icon">{icon}</div>

        <div className="notificationContent__wrapper">
          <div className="notification__content">
            <div className="notificationText__wrapper">
              <div className="notification__title">{title}</div>

              {!commentText ? (
                <div
                  title={notification_parameters.device.text.replace(/\sLBC/g, ' Credits')}
                  className="notification__text"
                >
                  <LbcMessage>{notification_parameters.device.text}</LbcMessage>
                </div>
              ) : stickerFromComment ? (
                <div className="sticker__comment">
                  <OptimizedImage src={stickerFromComment.url} waitLoad loading="lazy" />
                </div>
              ) : (
                <div title={commentText} className="notification__text">
                  {commentText}
                </div>
              )}
            </div>

            {notification_rule === RULE.NEW_CONTENT && (
              <FileThumbnail
                uri={notification_parameters.device.target}
                thumbnail={notification_parameters?.dynamic?.claim_thumbnail}
                className="notificationContent__thumbnail"
              />
            )}
            {notification_rule === RULE.NEW_LIVESTREAM && (
              <FileThumbnail
                thumbnail={notification_parameters.device.image_url}
                className="notificationContent__thumbnail"
              />
            )}
          </div>

          <div className="notification__extra">
            {!is_read && (
              <Button
                className="notification__markSeen"
                onClick={(e) => {
                  e.stopPropagation();
                  readNotification();
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
              className="menu__button notification__menuButton"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Icon size={18} icon={ICONS.MORE_VERTICAL} />
            </MenuButton>
            <MenuList className="menu__list">
              <MenuItem className="menu__link" onSelect={() => deleteNotification()}>
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
            <React.Suspense fallback={null}>
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
            </React.Suspense>
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
