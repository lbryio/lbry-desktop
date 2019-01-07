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
  firstRunCompleted: boolean,
  showSnackBarOnSubscribe: boolean,
  doToast: ({ message: string }) => void,
  buttonStyle: string,
};

export default (props: Props) => {
  const {
    uri,
    doChannelSubscribe,
    doChannelUnsubscribe,
    doOpenModal,
    subscriptions,
    isSubscribed,
    firstRunCompleted,
    showSnackBarOnSubscribe,
    doToast,
    buttonStyle,
  } = props;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
  const subscriptionLabel = isSubscribed ? __('Unsubscribe') : __('Subscribe');

  const { claimName } = parseURI(uri);

  return (
    <Button
      iconColor="red"
      icon={isSubscribed ? undefined : ICONS.HEART}
      button={buttonStyle || 'alt'}
      label={subscriptionLabel}
      onClick={e => {
        e.stopPropagation();

        if (!subscriptions.length && !firstRunCompleted) {
          doOpenModal(MODALS.FIRST_SUBSCRIPTION);
        }

        subscriptionHandler({
          channelName: claimName,
          uri,
        });

        if (showSnackBarOnSubscribe) {
          doToast({ message: `${__('Successfully subscribed to')} ${claimName}!` });
        }
      }}
    />
  );
};
