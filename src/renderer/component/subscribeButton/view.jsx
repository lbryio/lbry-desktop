// @flow
import React from 'react';
import * as modals from 'constants/modal_types';
import * as icons from 'constants/icons';
import Button from 'component/button';
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
  doOpenModal: string => void,
};

export default (props: Props) => {
  const {
    channelName,
    uri,
    subscriptions,
    doChannelSubscribe,
    doChannelUnsubscribe,
    doOpenModal,
  } = props;

  const isSubscribed =
    subscriptions.map(subscription => subscription.channelName).indexOf(channelName) !== -1;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
  const subscriptionLabel = isSubscribed ? __('Unsubscribe') : __('Subscribe');

  return channelName && uri ? (
    <Button
      icon={isSubscribed ? undefined : icons.HEART}
      button={isSubscribed ? 'danger' : 'alt'}
      label={subscriptionLabel}
      onClick={() => {
        if (!subscriptions.length) {
          doOpenModal(modals.FIRST_SUBSCRIPTION);
        }
        subscriptionHandler({
          channelName,
          uri,
        });
      }}
    />
  ) : null;
};
