// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  isBlocked: boolean,
  isBlockingOrUnBlocking: boolean,
  doCommentModUnBlock: (string) => void,
  doCommentModBlock: (string) => void,
};

function ChannelBlockButton(props: Props) {
  const { uri, doCommentModUnBlock, doCommentModBlock, isBlocked, isBlockingOrUnBlocking } = props;

  function handleClick() {
    if (isBlocked) {
      doCommentModUnBlock(uri);
    } else {
      doCommentModBlock(uri);
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
