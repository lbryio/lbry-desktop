// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  channelId?: string,
  // -- redux --
  defaultChannelId: ?string,
  activeChannelId: ?string,
};

const ButtonNavigateChannelId = (props: Props) => {
  const { channelId, defaultChannelId, activeChannelId, ...buttonProps } = props;

  const addWindowPendingActiveChannel = () => {
    if (channelId) {
      window.pendingActiveChannel = channelId;
    } else if (defaultChannelId && activeChannelId && defaultChannelId !== activeChannelId) {
      window.pendingActiveChannel = activeChannelId;
    }
  };

  return <Button {...buttonProps} onClick={addWindowPendingActiveChannel} />;
};

export default ButtonNavigateChannelId;
