// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import { MenuList, MenuItem } from '@reach/menu-button';
import ChannelThumbnail from 'component/channelThumbnail';
import Icon from 'component/common/icon';

type Props = {
  uri: string,
  clearPlayingUri: () => void,
  authorUri: string, // full LBRY Channel URI: lbry://@channel#123...
  commentId: string, // sha256 digest identifying the comment
  commentIsMine: boolean, // if this comment was signed by an owned channel
  deleteComment: (string, ?string) => void,
  linkedComment?: any,
  isPinned: boolean,
  pinComment: (string, boolean) => Promise<any>,
  blockChannel: (string) => void,
  fetchComments: (string) => void,
  handleEditComment: () => void,
  contentChannelPermanentUrl: any,
  activeChannelClaim: ?ChannelClaim,
  isTopLevel: boolean,
  commentModBlock: (string) => void,
  playingUri: ?PlayingUri,
  disableEdit?: boolean,
};

function CommentMenuList(props: Props) {
  const {
    uri,
    authorUri,
    commentIsMine,
    commentId,
    deleteComment,
    blockChannel,
    pinComment,
    clearPlayingUri,
    activeChannelClaim,
    contentChannelPermanentUrl,
    isTopLevel,
    isPinned,
    handleEditComment,
    fetchComments,
    commentModBlock,
    playingUri,
    disableEdit,
  } = props;
  const activeChannelIsCreator = activeChannelClaim && activeChannelClaim.permanent_url === contentChannelPermanentUrl;

  function handlePinComment(commentId, remove) {
    pinComment(commentId, remove).then(() => fetchComments(uri));
  }

  function handleDeleteComment() {
    if (playingUri && playingUri.source === 'comment') {
      clearPlayingUri();
    }
    deleteComment(commentId, commentIsMine ? undefined : contentChannelPermanentUrl);
  }

  function handleCommentBlock() {
    commentModBlock(authorUri);
  }

  function handleCommentMute() {
    blockChannel(authorUri);
  }

  return (
    <MenuList className="menu__list">
      {activeChannelIsCreator && <div className="comment__menu-title">{__('Creator tools')}</div>}

      {activeChannelIsCreator && isTopLevel && (
        <MenuItem
          className="comment__menu-option menu__link"
          onSelect={isPinned ? () => handlePinComment(commentId, true) : () => handlePinComment(commentId, false)}
        >
          <span className={'button__content'}>
            <Icon aria-hidden icon={ICONS.PIN} className={'icon'} />
            {isPinned ? __('Unpin') : __('Pin')}
          </span>
        </MenuItem>
      )}

      {activeChannelClaim &&
        (activeChannelClaim.permanent_url === authorUri ||
          activeChannelClaim.permanent_url === contentChannelPermanentUrl) && (
          <MenuItem className="comment__menu-option" onSelect={handleDeleteComment}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.DELETE} />
              {__('Remove')}
            </div>
          </MenuItem>
        )}

      {commentIsMine && activeChannelClaim && activeChannelClaim.permanent_url === authorUri && !disableEdit && (
        <MenuItem className="comment__menu-option menu__link" onSelect={handleEditComment}>
          <Icon aria-hidden icon={ICONS.EDIT} />
          {__('Edit')}
        </MenuItem>
      )}

      {!commentIsMine && (
        <MenuItem className="comment__menu-option" onSelect={handleCommentBlock}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.BLOCK} />
            {__('Block')}
          </div>
          {activeChannelIsCreator && (
            <span className="comment__menu-help">{__('Prevent this channel from interacting with you.')}</span>
          )}
        </MenuItem>
      )}

      {!commentIsMine && (
        <MenuItem className="comment__menu-option" onSelect={handleCommentMute}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.MUTE} />
            {__('Mute')}
          </div>
          {activeChannelIsCreator && (
            <span className="comment__menu-help">{__('Hide this channel for you only.')}</span>
          )}
        </MenuItem>
      )}

      {activeChannelClaim && (
        <div className="comment__menu-active">
          <ChannelThumbnail uri={activeChannelClaim.permanent_url} />
          <div className="comment__menu-channel">
            {__('Interacting as %channelName%', { channelName: activeChannelClaim.name })}
          </div>
        </div>
      )}
    </MenuList>
  );
}

export default CommentMenuList;
