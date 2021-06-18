// @flow
import React from 'react';
import Button from 'component/button';
import { BLOCK_LEVEL } from 'constants/comment';
import { parseURI } from 'lbry-redux';

type Props = {
  uri: string,
  blockLevel?: string,
  creatorUri?: string,
  isBlocked: boolean,
  isBlockingOrUnBlocking: boolean,
  isToggling: boolean,
  doCommentModUnBlock: (string, boolean) => void,
  doCommentModBlock: (string, boolean) => void,
  doCommentModUnBlockAsAdmin: (string, string) => void,
  doCommentModBlockAsAdmin: (string, string) => void,
  doCommentModUnBlockAsModerator: (string, string, string) => void,
  doCommentModBlockAsModerator: (string, string, string) => void,
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
          doCommentModBlock(uri, false);
        }
        break;

      case BLOCK_LEVEL.MODERATOR:
        if (creatorUri) {
          const { channelClaimId } = parseURI(creatorUri);
          if (isBlocked) {
            doCommentModUnBlockAsModerator(uri, channelClaimId, '');
          } else {
            doCommentModBlockAsModerator(uri, channelClaimId, '');
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

  function getButtonText(blockLevel) {
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
