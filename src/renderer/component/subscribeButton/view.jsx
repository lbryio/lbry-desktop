// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
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
  doOpenModal: ({ id: string }) => void,
};

export default (props: Props) => {
  const {
    channelName,
    uri,
    doChannelSubscribe,
    doChannelUnsubscribe,
    doOpenModal,
    subscriptions,
    isSubscribed,
  } = props;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
  const subscriptionLabel = isSubscribed ? __('Unsubscribe') : __('Subscribe');

  return channelName && uri ? (
    <Button
      iconColor="red"
      icon={isSubscribed ? undefined : ICONS.HEART}
      button="alt"
      label={subscriptionLabel}
      onClick={e => {
        e.stopPropagation();

        if (!subscriptions.length) {
          doOpenModal(MODALS.FIRST_SUBSCRIPTION);
        }
        subscriptionHandler({
          channelName,
          uri,
        });
      }}
    />
  ) : null;
};
