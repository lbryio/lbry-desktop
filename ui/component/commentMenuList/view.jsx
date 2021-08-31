// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import { MenuList, MenuItem } from '@reach/menu-button';
import ChannelThumbnail from 'component/channelThumbnail';
import Icon from 'component/common/icon';
import { parseURI } from 'lbry-redux';

type Props = {
  authorUri: string, // full LBRY Channel URI: lbry://@channel#123...
  commentId: string, // sha256 digest identifying the comment
  isTopLevel: boolean,
  isPinned: boolean,
  commentIsMine: boolean, // if this comment was signed by an owned channel
  disableEdit?: boolean,
  disableRemove?: boolean,
  supportAmount?: any,
  handleEditComment: () => void,
  // --- select ---
  claim: ?Claim,
  claimIsMine: boolean,
  contentChannelPermanentUrl: any,
  activeChannelClaim: ?ChannelClaim,
  playingUri: ?PlayingUri,
  moderationDelegatorsById: { [string]: { global: boolean, delegators: { name: string, claimId: string } } },
  // --- perform ---
  openModal: (id: string, {}) => void,
  clearPlayingUri: () => void,
  muteChannel: (string) => void,
  pinComment: (string, string, boolean) => Promise<any>,
  commentModBlock: (string) => void,
  commentModBlockAsAdmin: (string, string) => void,
  commentModBlockAsModerator: (string, string, string) => void,
  commentModAddDelegate: (string, string, ChannelClaim) => void,
  setQuickReply: (any) => void,
};

function CommentMenuList(props: Props) {
  const {
    claim,
    authorUri,
    commentIsMine,
    commentId,
    muteChannel,
    pinComment,
    clearPlayingUri,
    activeChannelClaim,
    contentChannelPermanentUrl,
    isTopLevel,
    isPinned,
    handleEditComment,
    commentModBlock,
    commentModBlockAsAdmin,
    commentModBlockAsModerator,
    commentModAddDelegate,
    playingUri,
    disableEdit,
    disableRemove,
    moderationDelegatorsById,
    openModal,
    supportAmount,
    setQuickReply,
  } = props;

  const contentChannelClaim = !claim
    ? null
    : claim.value_type === 'channel'
    ? claim
    : claim.signing_channel && claim.is_channel_signature_valid
    ? claim.signing_channel
    : null;

  const activeModeratorInfo = activeChannelClaim && moderationDelegatorsById[activeChannelClaim.claim_id];
  const activeChannelIsCreator = activeChannelClaim && activeChannelClaim.permanent_url === contentChannelPermanentUrl;
  const activeChannelIsAdmin = activeChannelClaim && activeModeratorInfo && activeModeratorInfo.global;
  const activeChannelIsModerator =
    activeChannelClaim &&
    contentChannelClaim &&
    activeModeratorInfo &&
    Object.values(activeModeratorInfo.delegators).includes(contentChannelClaim.claim_id);

  function handlePinComment(commentId, claimId, remove) {
    pinComment(commentId, claimId, remove);
  }

  function handleDeleteComment() {
    if (playingUri && playingUri.source === 'comment') {
      clearPlayingUri();
    }
    openModal(MODALS.CONFIRM_REMOVE_COMMENT, {
      commentId,
      commentIsMine,
      contentChannelPermanentUrl,
      supportAmount,
      setQuickReply,
    });
  }

  function handleCommentBlock() {
    commentModBlock(authorUri);
  }

  function handleCommentMute() {
    muteChannel(authorUri);
  }

  function assignAsModerator() {
    if (activeChannelClaim && authorUri) {
      const { channelName, channelClaimId } = parseURI(authorUri);
      commentModAddDelegate(channelClaimId, channelName, activeChannelClaim);
    }
  }

  function blockCommentAsModerator() {
    if (activeChannelClaim && contentChannelClaim) {
      commentModBlockAsModerator(authorUri, contentChannelClaim.claim_id, activeChannelClaim.claim_id);
    }
  }

  function blockCommentAsAdmin() {
    if (activeChannelClaim) {
      commentModBlockAsAdmin(authorUri, activeChannelClaim.claim_id);
    }
  }

  return (
    <MenuList className="menu__list">
      {activeChannelIsCreator && <div className="comment__menu-title">{__('Creator tools')}</div>}

      {activeChannelIsCreator && isTopLevel && (
        <MenuItem
          className="comment__menu-option menu__link"
          onSelect={() => handlePinComment(commentId, claim ? claim.claim_id : '', isPinned)}
        >
          <span className={'button__content'}>
            <Icon aria-hidden icon={ICONS.PIN} className={'icon'} />
            {isPinned ? __('Unpin') : __('Pin')}
          </span>
        </MenuItem>
      )}

      {activeChannelIsCreator && (
        <MenuItem className="comment__menu-option" onSelect={assignAsModerator}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.ADD} />
            {__('Add as moderator')}
          </div>
          <span className="comment__menu-help">
            {__('Assign this user to moderate %channel%', {
              channel: activeChannelClaim ? activeChannelClaim.name : __('your channel'),
            })}
          </span>
        </MenuItem>
      )}

      {!disableRemove &&
        activeChannelClaim &&
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

      {!commentIsMine && (activeChannelIsAdmin || activeChannelIsModerator) && (
        <div className="comment__menu-title">{__('Moderator tools')}</div>
      )}

      {!commentIsMine && activeChannelIsAdmin && (
        <MenuItem className="comment__menu-option" onSelect={blockCommentAsAdmin}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.GLOBE} />
            {__('Global Block')}
          </div>
          <span className="comment__menu-help">{__('Block this channel as global admin')}</span>
        </MenuItem>
      )}

      {!commentIsMine && activeChannelIsModerator && (
        <MenuItem className="comment__menu-option" onSelect={blockCommentAsModerator}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.BLOCK} />
            {__('Moderator Block')}
          </div>
          <span className="comment__menu-help">
            {__('Block this channel on behalf of %creator%', {
              creator: contentChannelClaim ? contentChannelClaim.name : __('creator'),
            })}
          </span>
        </MenuItem>
      )}

      {activeChannelClaim && (
        <div className="comment__menu-active">
          <ChannelThumbnail xsmall noLazyLoad uri={activeChannelClaim.permanent_url} />
          <div className="comment__menu-channel">
            {__('Interacting as %channelName%', { channelName: activeChannelClaim.name })}
          </div>
        </div>
      )}
    </MenuList>
  );
}

export default CommentMenuList;
