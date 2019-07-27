// @flow
// import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React, { useRef } from 'react';
// import { parseURI } from 'lbry-redux';
import Button from 'component/button';
// import useHover from 'util/use-hover';

type Props = {
  uri: string,
  isSubscribed: boolean,
  toggleBlockChannel: (uri: string) => void,
  channelIsBlocked: boolean,
  blockedChannels: Array<string>,
  doToast: ({ message: string }) => void,
};
//
// maybe x-octagon or x-square icon
export default function BlockButton(props: Props) {
  const {
    uri,
    toggleBlockChannel,
    channelIsBlocked,
    // blockedChannels,
    // doToast,
    // props
  } = props;

  const blockRef = useRef();
  // const isHovering = useHover(blockRef);
  // const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
  // const subscriptionLabel = isSubscribed ? __('Following') : __('Follow');
  // const unfollowOverride = isSubscribed && isHovering && __('Unfollow');
  // const blockedOverride = channelIsBlocked && isHovering

  return (
    <Button
      ref={blockRef}
      iconColor="red"
      icon={ICONS.NO}
      button={'alt'}
      label={channelIsBlocked ? __('Unblock') : __('Block')}
      onClick={e => {
        e.stopPropagation();
        toggleBlockChannel(uri);
      }}
    />
  );
}
