// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';

type SubscribtionArgs = {
  channelName: string,
  uri: string,
};

type Props = {
  uri: string,
  isSubscribed: boolean,
  subscriptions: Array<string>,
  doChannelSubscribe: ({ channelName: string, uri: string }) => void,
  doChannelUnsubscribe: SubscribtionArgs => void,
  doOpenModal: (id: string) => void,
  showSnackBarOnSubscribe: boolean,
  doToast: ({ message: string }) => void,
};

export default function SubscribeButton(props: Props) {
  const {
    uri,
    doChannelSubscribe,
    doChannelUnsubscribe,
    doOpenModal,
    subscriptions,
    isSubscribed,
    showSnackBarOnSubscribe,
    doToast,
  } = props;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
  const subscriptionLabel = isSubscribed ? __('Following') : __('Follow');

  const { claimName } = parseURI(uri);

  return (
    <Button
      iconColor="red"
      icon={ICONS.SUBSCRIPTION}
      button={'alt'}
      label={subscriptionLabel}
      onClick={e => {
        e.stopPropagation();

        if (!subscriptions.length) {
          doOpenModal(MODALS.FIRST_SUBSCRIPTION);
        }

        subscriptionHandler({
          channelName: claimName,
          uri,
        });

        if (showSnackBarOnSubscribe) {
          doToast({ message: `${__('Now following ')} ${claimName}!` });
        }
      }}
    />
  );
}
