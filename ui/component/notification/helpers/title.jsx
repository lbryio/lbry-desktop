// @flow
import React from 'react';
import LbcMessage from 'component/common/lbc-message';
import I18nMessage from 'component/i18nMessage';
import UriIndicator from 'component/uriIndicator';
import { RULE } from 'constants/notifications';

function getChannelNameLink(channelUrl: string, channelName: ?string) {
  return <UriIndicator link showAtSign uri={channelUrl} channelInfo={{ uri: channelUrl, name: channelName }} />;
}

export function generateNotificationTitle(rule: string, notificationParams: any, channelName: ?string) {
  switch (rule) {
    case RULE.COMMENT: {
      const channelUrl = notificationParams?.dynamic?.comment_author;
      if (notificationParams?.dynamic?.amount > 0) {
        const amountStr = `${parseFloat(notificationParams.dynamic.amount)} ${
          notificationParams.dynamic.currency || 'LBC'
        }`;
        return channelUrl ? (
          <I18nMessage
            tokens={{
              commenter: getChannelNameLink(channelUrl, channelName),
              amount: <LbcMessage>{amountStr}</LbcMessage>,
              title: <span className="notification__claim-title">{notificationParams.dynamic?.claim_title}</span>,
            }}
          >
            %commenter% sent a %amount% hyperchat on %title%
          </I18nMessage>
        ) : (
          notificationParams.device.title
        );
      } else {
        return channelUrl ? (
          <I18nMessage
            tokens={{
              commenter: getChannelNameLink(channelUrl, channelName),
              title: <span className="notification__claim-title">{notificationParams.dynamic?.claim_title}</span>,
            }}
          >
            %commenter% commented on %title%
          </I18nMessage>
        ) : (
          notificationParams.device.title
        );
      }
    }

    case RULE.CREATOR_COMMENT: {
      const channelUrl = notificationParams?.dynamic?.comment_author;
      return channelUrl ? (
        <I18nMessage
          tokens={{
            commenter: getChannelNameLink(channelUrl, channelName),
            title: <span className="notification__claim-title">{notificationParams.dynamic?.claim_title}</span>,
          }}
        >
          %commenter% commented on %title%
        </I18nMessage>
      ) : (
        notificationParams.device.title
      );
    }

    case RULE.COMMENT_REPLY: {
      const channelUrl = notificationParams?.dynamic?.reply_author;
      return channelUrl ? (
        <I18nMessage
          tokens={{
            commenter: getChannelNameLink(channelUrl, channelName),
            title: <span className="notification__claim-title">{notificationParams.dynamic?.claim_title}</span>,
          }}
        >
          %commenter% replied to you on %title%
        </I18nMessage>
      ) : (
        notificationParams.device.title
      );
    }

    case RULE.NEW_CONTENT: {
      const channelUrl = notificationParams?.dynamic?.channel_url;
      return channelUrl ? (
        <I18nMessage tokens={{ creator: getChannelNameLink(channelUrl, channelName) }}>
          New content from %creator%
        </I18nMessage>
      ) : (
        notificationParams.device.title
      );
    }

    case RULE.NEW_LIVESTREAM: {
      const channelUrl = notificationParams?.dynamic?.channel_url;
      return channelUrl ? (
        <I18nMessage tokens={{ streamer: getChannelNameLink(channelUrl, channelName) }}>
          %streamer% is live streaming!
        </I18nMessage>
      ) : (
        notificationParams.device.title
      );
    }

    case RULE.CREATOR_SUBSCRIBER:
    case RULE.DAILY_WATCH_AVAILABLE:
    case RULE.DAILY_WATCH_REMIND:
    case RULE.WEEKLY_WATCH_REMINDER:
    case RULE.MISSED_OUT:
    case RULE.REWARDS_APPROVAL_PROMPT:
    case RULE.FIAT_TIP:
      // Use Commentron default
      return __(notificationParams.device.title);

    default:
      console.log(`TITLE: Unhandled notification_rule:%c ${rule}`, 'color:yellow'); // eslint-disable-line
      return __(notificationParams.device.title);
  }
}
