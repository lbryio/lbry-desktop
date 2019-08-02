// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React, { useRef } from 'react';
import Button from 'component/button';
import useHover from 'util/use-hover';

type Props = {
  uri: string,
  shortUrl: string,
  isSubscribed: boolean,
  toggleBlockChannel: (uri: string) => void,
  channelIsBlocked: boolean,
  doToast: ({ message: string, linkText: string, linkTarget: string }) => void,
};

export default function BlockButton(props: Props) {
  const { uri, shortUrl, toggleBlockChannel, channelIsBlocked, doToast } = props;

  const blockRef = useRef();
  const isHovering = useHover(blockRef);
  const blockLabel = channelIsBlocked ? __('Blocked') : __('Block');
  const blockedOverride = channelIsBlocked && isHovering && __('Unblock');

  return (
    <Button
      ref={blockRef}
      iconColor="red"
      icon={ICONS.BLOCK}
      button={'alt'}
      label={blockedOverride || blockLabel}
      onClick={e => {
        e.stopPropagation();
        if (!channelIsBlocked) {
          doToast({ message: `Blocked ${shortUrl}`, linkText: 'Manage', linkTarget: `/${PAGES.BLOCKED}` });
        }
        toggleBlockChannel(uri);
      }}
    />
  );
}
