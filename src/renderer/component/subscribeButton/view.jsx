// @flow
import React from 'react';
import { MODALS } from 'lbry-redux';
import * as icons from 'constants/icons';
import Button from 'component/button';

type SubscribtionArgs = {
  channelName: string,
  uri: string,
};

type Props = {
  channelName: ?string,
  uri: ?string,
  isSubscribed: boolean,
  subscriptions: Array<string>,
  doChannelSubscribe: ({ channelName: string, uri: string }) => void,
  doChannelUnsubscribe: SubscribtionArgs => void,
  doNotify: ({ id: string }) => void,
};

export default (props: Props) => {
  const {
    channelName,
    uri,
    doChannelSubscribe,
    doChannelUnsubscribe,
    doNotify,
    subscriptions,
    isSubscribed,
  } = props;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
  const subscriptionLabel = isSubscribed ? __('Unsubscribe') : __('Subscribe');

  return channelName && uri ? (
    <Button
      iconColor="red"
      icon={isSubscribed ? undefined : icons.HEART}
      button="alt"
      label={subscriptionLabel}
      onClick={e => {
        e.stopPropagation();

        if (!subscriptions.length) {
          doNotify({ id: MODALS.FIRST_SUBSCRIPTION });
        }
        subscriptionHandler({
          channelName,
          uri,
        });
      }}
    />
  ) : null;
};
