// @flow
import React from 'react';
import { MODALS } from 'lbry-redux';
import * as icons from 'constants/icons';
import Button from 'component/button';
import type { Subscription } from 'types/subscription';

type SubscribtionArgs = {
  channelName: string,
  uri: string,
};

type Props = {
  channelName: ?string,
  uri: ?string,
  subscriptions: Array<Subscription>,
  doChannelSubscribe: ({ channelName: string, uri: string }) => void,
  doChannelUnsubscribe: SubscribtionArgs => void,
  doNotify: ({ id: string }) => void,
};

export default (props: Props) => {
  const {
    channelName,
    uri,
    subscriptions,
    doChannelSubscribe,
    doChannelUnsubscribe,
    doNotify,
  } = props;

  const isSubscribed =
    subscriptions.map(subscription => subscription.channelName).indexOf(channelName) !== -1;

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
