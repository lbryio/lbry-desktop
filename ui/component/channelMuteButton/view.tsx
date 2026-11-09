import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  isMuted: boolean,
  channelClaim: ChannelClaim | null | undefined,
  doChannelMute: (arg1: string, arg2: boolean) => void,
  doChannelUnmute: (arg1: string, arg2: boolean) => void
};

function ChannelMuteButton(props: Props) {
  const { uri, doChannelMute, doChannelUnmute, isMuted } = props;

  function handleClick() {
    if (isMuted) {
      doChannelUnmute(uri, false);
    } else {
      doChannelMute(uri, false);
    }
  }

  return (
    // @ts-expect-error - TS2322 (ts-migration)
    <Button button={isMuted ? 'alt' : 'secondary'} label={isMuted ? __('Unmute') : __('Mute')} onClick={handleClick} />
  );
}

export default ChannelMuteButton;
