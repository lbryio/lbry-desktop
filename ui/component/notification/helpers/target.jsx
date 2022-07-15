// @flow
import { LINKED_COMMENT_QUERY_PARAM } from 'constants/comment';
import { RULE } from 'constants/notifications';
import * as PAGES from 'constants/pages';
import { DISCUSSION_PAGE, PAGE_VIEW_QUERY } from 'page/channel/view'; // TODO: move into const to avoid lazy-load problems
import { parseURI } from 'util/lbryURI';
import { formatLbryUrlForWeb } from 'util/url';

export function getNotificationTarget(notification: WebNotification) {
  const { notification_rule, notification_parameters } = notification;

  switch (notification_rule) {
    case RULE.WEEKLY_WATCH_REMINDER:
    case RULE.DAILY_WATCH_AVAILABLE:
    case RULE.DAILY_WATCH_REMIND:
      return `/$/${PAGES.CHANNELS_FOLLOWING}`;
    case RULE.MISSED_OUT:
    case RULE.REWARDS_APPROVAL_PROMPT:
      return `/$/${PAGES.REWARDS_VERIFY}?redirect=/$/${PAGES.REWARDS}`;
    case RULE.FIAT_TIP:
      return `/$/${PAGES.WALLET}?fiatType=incoming&tab=fiat-payment-history&currency=fiat`;
    default:
      return notification_parameters.device.target;
  }
}

function getUrlParams(notification, notificationTarget) {
  const { notification_rule, notification_parameters } = notification;

  const isCommentNotification =
    notification_rule === RULE.COMMENT ||
    notification_rule === RULE.COMMENT_REPLY ||
    notification_rule === RULE.CREATOR_COMMENT;

  const urlParams = new URLSearchParams();

  if (isCommentNotification && notification_parameters.dynamic.hash) {
    urlParams.append(LINKED_COMMENT_QUERY_PARAM, notification_parameters.dynamic.hash);
  }

  try {
    const { isChannel } = parseURI(notificationTarget);
    if (isChannel) urlParams.append(PAGE_VIEW_QUERY, DISCUSSION_PAGE);
  } catch (e) {}

  return urlParams;
}

/**
 *
 * @param notification
 * @param target Optional (minor optimization if pre-calculated outside). Must be value from getNotificationTarget().
 * @returns {string}
 */
export function getNotificationLink(notification: WebNotification, target: ?string) {
  const notificationTarget = target || getNotificationTarget(notification);
  const urlParams = getUrlParams(notification, notificationTarget);
  return `${formatLbryUrlForWeb(notificationTarget)}?${urlParams.toString()}`;
}
