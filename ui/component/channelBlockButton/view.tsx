import React from 'react';
import Button from 'component/button';
import { BLOCK_LEVEL } from 'constants/comment';

type Props = {
  uri: string,
  blockLevel?: string,
  creatorUri?: string,
  isBlocked: boolean,
  isBlockingOrUnBlocking: boolean,
  isToggling: boolean,
  doCommentModUnBlock: (arg1: string, arg2: boolean) => void,
  doCommentModBlock: (arg1: string, arg2: number | null | undefined, arg3: boolean) => void,
  doCommentModUnBlockAsAdmin: (arg1: string, arg2: string) => void,
  doCommentModBlockAsAdmin: (arg1: string, arg2: string) => void,
  doCommentModUnBlockAsModerator: (arg1: string, arg2: string, arg3: string) => void,
  doCommentModBlockAsModerator: (arg1: string, arg2: string, arg3: string) => void
};

function ChannelBlockButton(props: Props) {
  const {
    uri,
    blockLevel,
    creatorUri,
    doCommentModUnBlock,
    doCommentModBlock,
    doCommentModUnBlockAsAdmin,
    doCommentModBlockAsAdmin,
    doCommentModUnBlockAsModerator,
    doCommentModBlockAsModerator,
    isBlocked,
    isBlockingOrUnBlocking,
    isToggling,
  } = props;

  function handleClick() {
    switch (blockLevel) {
      default:
      case BLOCK_LEVEL.SELF:
        if (isBlocked) {
          doCommentModUnBlock(uri, false);
        } else {
          doCommentModBlock(uri, undefined, false);
        }
        break;

      case BLOCK_LEVEL.MODERATOR:
        if (creatorUri) {
          if (isBlocked) {
            doCommentModUnBlockAsModerator(uri, creatorUri, '');
          } else {
            doCommentModBlockAsModerator(uri, creatorUri, '');
          }
        }
        break;

      case BLOCK_LEVEL.ADMIN:
        if (isBlocked) {
          doCommentModUnBlockAsAdmin(uri, '');
        } else {
          doCommentModBlockAsAdmin(uri, '');
        }
        break;
    }
  }

  function getButtonText(blockLevel: unknown) {
    switch (blockLevel) {
      default:
      case BLOCK_LEVEL.SELF:
      case BLOCK_LEVEL.ADMIN:
        return isBlocked
          ? isBlockingOrUnBlocking
            ? __('Unblocking...')
            : __('Unblock')
          : isBlockingOrUnBlocking
          ? __('Blocking...')
          : __('Block');

      case BLOCK_LEVEL.MODERATOR:
        if (isToggling) {
          return isBlocked ? __('Unblocking...') : __('Blocking...');
        } else {
          return isBlocked ? __('Unblock') : __('Block');
        }
    }
  }

  return <Button button={isBlocked ? 'alt' : 'secondary'} label={getButtonText(blockLevel)} onClick={handleClick} />;
}

export default ChannelBlockButton;
