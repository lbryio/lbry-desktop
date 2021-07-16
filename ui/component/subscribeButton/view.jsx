// @flow
import * as ICONS from 'constants/icons';
import React, { useRef } from 'react';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import { useIsMobile } from 'effects/use-screensize';
import { ENABLE_UI_NOTIFICATIONS } from 'config';

type SubscriptionArgs = {
  channelName: string,
  uri: string,
  notificationsDisabled?: boolean,
};

type Props = {
  permanentUrl: ?string,
  isSubscribed: boolean,
  doChannelSubscribe: (SubscriptionArgs, boolean) => void,
  doChannelUnsubscribe: (SubscriptionArgs, boolean) => void,
  doToast: ({ message: string }) => void,
  shrinkOnMobile: boolean,
  notificationsDisabled: boolean,
  user: ?User,
  uri: string,
};

export default function SubscribeButton(props: Props) {
  const {
    permanentUrl,
    doChannelSubscribe,
    doChannelUnsubscribe,
    isSubscribed,
    doToast,
    shrinkOnMobile = false,
    notificationsDisabled,
    user,
    uri,
  } = props;

  const buttonRef = useRef();
  const isMobile = useIsMobile();
  let isHovering = useHover(buttonRef);
  isHovering = isMobile ? true : isHovering;
  const uiNotificationsEnabled = (user && user.experimental_ui) || ENABLE_UI_NOTIFICATIONS;

  const { channelName: rawChannelName } = parseURI(uri);
  const { channelName } = parseURI(permanentUrl);
  const claimName = '@' + channelName;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
  const subscriptionLabel = isSubscribed
    ? __('Following --[button label indicating a channel has been followed]--')
    : __('Follow');
  const unfollowOverride = isSubscribed && isHovering && __('Unfollow');

  const label = isMobile && shrinkOnMobile ? '' : unfollowOverride || subscriptionLabel;
  const titlePrefix = isSubscribed ? __('Unfollow this channel') : __('Follow this channel');

  if (isSubscribed && !permanentUrl && rawChannelName) {
    return (
      <div className="button-group">
        <Button
          ref={buttonRef}
          iconColor="red"
          largestLabel={isMobile && shrinkOnMobile ? '' : subscriptionLabel}
          icon={ICONS.UNSUBSCRIBE}
          button={'alt'}
          requiresAuth={IS_WEB}
          label={label}
          title={titlePrefix}
          onClick={(e) => {
            e.stopPropagation();

            subscriptionHandler({
              channelName: '@' + rawChannelName,
              uri: uri,
              notificationsDisabled: true,
            }, true);
          }}
        />
      </div>
    );
  }

  return permanentUrl ? (
    <div className="button-group">
      <Button
        ref={buttonRef}
        iconColor="red"
        largestLabel={isMobile && shrinkOnMobile ? '' : subscriptionLabel}
        icon={unfollowOverride ? ICONS.UNSUBSCRIBE : ICONS.SUBSCRIBE}
        button={'alt'}
        requiresAuth={IS_WEB}
        label={label}
        title={titlePrefix}
        onClick={(e) => {
          e.stopPropagation();

          subscriptionHandler({
            channelName: claimName,
            uri: permanentUrl,
            notificationsDisabled: true,
          }, true);
        }}
      />
      {isSubscribed && uiNotificationsEnabled && (
        <Button
          button="alt"
          icon={notificationsDisabled ? ICONS.BELL : ICONS.BELL_ON}
          aria-label={notificationsDisabled ? __('Turn on notifications') : __('Turn off notifications')}
          onClick={() => {
            const newNotificationsDisabled = !notificationsDisabled;

            doChannelSubscribe({
              channelName: claimName,
              uri: permanentUrl,
              notificationsDisabled: newNotificationsDisabled,
            }, false);

            doToast({ message: __(newNotificationsDisabled ? 'Notifications turned off for %channel%' : 'Notifications turned on for %channel%!',
              { channel: claimName }) });
          }}
        />
      )}
    </div>
  ) : null;
}
