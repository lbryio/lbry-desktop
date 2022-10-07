// @flow
import React from 'react';
import LbcMessage from 'component/common/lbc-message';
import OptimizedImage from 'component/optimizedImage';
import {
  RULE,
  CHANNEL_NAME_AT_SENTENCE_START_REGEX,
  MEMBERSHIP_NAME_AT_SENTENCE_END_REGEX,
} from 'constants/notifications';
import { parseSticker } from 'util/comments';
import I18nMessage from 'component/i18nMessage';

function replaceLbcWithCredits(str: string) {
  return str.replace(/\sLBC/g, ' Credits');
}

export function generateNotificationText(rule: string, notificationParams: any) {
  switch (rule) {
    default:
      console.log(`TEXT: Unhandled notification_rule:%c ${rule}`, 'color:yellow'); // eslint-disable-line

    // eslint-disable-next-line no-fallthrough -- Intended fallthrough from 'default'
    case RULE.NEW_CONTENT:
    case RULE.NEW_LIVESTREAM:
    case RULE.CREATOR_SUBSCRIBER:
    case RULE.DAILY_WATCH_AVAILABLE:
    case RULE.DAILY_WATCH_REMIND:
    case RULE.WEEKLY_WATCH_REMINDER:
    case RULE.MISSED_OUT:
    case RULE.REWARDS_APPROVAL_PROMPT:
    case RULE.FIAT_TIP:
      return (
        <div className="notification__text" title={replaceLbcWithCredits(notificationParams.device.text)}>
          <LbcMessage>{notificationParams.device.text}</LbcMessage>
        </div>
      );

    case RULE.NEW_MEMBER: {
      const memberNameMatch = notificationParams.device.text.match(CHANNEL_NAME_AT_SENTENCE_START_REGEX);
      const memberName = memberNameMatch && memberNameMatch[0];

      const membershipTierNameMatch = notificationParams.device.text.match(MEMBERSHIP_NAME_AT_SENTENCE_END_REGEX);
      const membershipTierName = membershipTierNameMatch && membershipTierNameMatch[0].replace(': ', '');

      return (
        <I18nMessage
          tokens={{ new_member_name: memberName || __('An anonymous user'), membership_tier_name: membershipTierName }}
        >
          %new_member_name% has joined: %membership_tier_name%
        </I18nMessage>
      );
    }

    case RULE.COMMENT:
    case RULE.CREATOR_COMMENT:
    case RULE.COMMENT_REPLY: {
      const commentText = notificationParams.dynamic.comment;
      const sticker = commentText && parseSticker(commentText);
      return (
        <div className="notification__text notification__text--replies" title={sticker ? undefined : commentText}>
          {sticker && (
            <div className="sticker__comment">
              <OptimizedImage src={sticker.url} waitLoad loading="lazy" />
            </div>
          )}
          {!sticker && (
            <blockquote>
              <LbcMessage>{commentText}</LbcMessage>
            </blockquote>
          )}
        </div>
      );
    }
  }
}
