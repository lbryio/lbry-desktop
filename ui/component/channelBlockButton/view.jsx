// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  isBlocked: boolean,
  isBlockingOrUnBlocking: boolean,
  doCommentModUnBlock: (string, boolean) => void,
  doCommentModBlock: (string, boolean) => void,
};

function ChannelBlockButton(props: Props) {
  const { uri, doCommentModUnBlock, doCommentModBlock, isBlocked, isBlockingOrUnBlocking } = props;

  function handleClick() {
    if (isBlocked) {
      doCommentModUnBlock(uri, false);
    } else {
      doCommentModBlock(uri, false);
    }
  }

  return (
    <Button
      button={isBlocked ? 'alt' : 'secondary'}
      label={
        isBlocked
          ? isBlockingOrUnBlocking
            ? __('Unblocking...')
            : __('Unblock')
          : isBlockingOrUnBlocking
            ? __('Blocking...')
            : __('Block')
      }
      onClick={handleClick}
    />
  );
}

export default ChannelBlockButton;
