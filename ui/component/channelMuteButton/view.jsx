// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  isMuted: boolean,
  channelClaim: ?ChannelClaim,
  doToggleMuteChannel: (string) => void,
};

function ChannelBlockButton(props: Props) {
  const { uri, doToggleMuteChannel, isMuted } = props;

  return (
    <Button
      button={isMuted ? 'alt' : 'secondary'}
      label={isMuted ? __('Unmute') : __('Mute')}
      onClick={() => doToggleMuteChannel(uri)}
    />
  );
}

export default ChannelBlockButton;
