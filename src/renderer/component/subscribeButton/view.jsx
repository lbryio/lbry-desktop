// @flow
import React from 'react';
import Button from 'component/link';
import type { Subscription } from 'redux/reducers/subscriptions';

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
};

export default (props: Props) => {
  const { channelName, uri, subscriptions, doChannelSubscribe, doChannelUnsubscribe } = props;
  const isSubscribed =
    subscriptions.map(subscription => subscription.channelName).indexOf(channelName) !== -1;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;

  const subscriptionLabel = isSubscribed ? __('Unsubscribe') : __('Subscribe');

  return channelName && uri ? (
    <Button
      icon={isSubscribed ? undefined : "Heart"}
      button={isSubscribed ? "danger" : "alt"}
      label={subscriptionLabel}
      onClick={() =>
        subscriptionHandler({
          channelName,
          uri,
        })
      }
    />
  ) : null;
};
