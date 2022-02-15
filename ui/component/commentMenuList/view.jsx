// @flow
import { getChannelFromClaim } from 'util/claim';
import { MenuList, MenuItem } from '@reach/menu-button';
import { parseURI } from 'util/lbryURI';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import ChannelThumbnail from 'component/channelThumbnail';
import Icon from 'component/common/icon';
import React from 'react';

type Props = {
  uri: ?string,
  authorUri: string, // full LBRY Channel URI: lbry://@channel#123...
  commentId: string, // sha256 digest identifying the comment
  isTopLevel: boolean,
  isPinned: boolean,
  commentIsMine: boolean, // if this comment was signed by an owned channel
  disableEdit?: boolean,
  disableRemove?: boolean,
  supportAmount?: any,
  // --- select ---
  claim: ?Claim,
  claimIsMine: boolean,
  activeChannelClaim: ?ChannelClaim,
  playingUri: ?PlayingUri,
  moderationDelegatorsById: { [string]: { global: boolean, delegators: { name: string, claimId: string } } },
  // --- perform ---
  doToast: ({ message: string }) => void,
  handleEditComment: () => void,
  openModal: (id: string, {}) => void,
  clearPlayingUri: () => void,
  muteChannel: (string) => void,
  pinComment: (string, string, boolean) => Promise<any>,
  commentModAddDelegate: (string, string, ChannelClaim) => void,
  setQuickReply: (any) => void,
};

function CommentMenuList(props: Props) {
  const {
    uri,
    claim,
    authorUri,
    commentIsMine,
    commentId,
    activeChannelClaim,
    isTopLevel,
    isPinned,
    playingUri,
    moderationDelegatorsById,
    disableEdit,
    disableRemove,
    supportAmount,
    handleEditComment,
    openModal,
    clearPlayingUri,
    muteChannel,
    pinComment,
    commentModAddDelegate,
    setQuickReply,
  } = props;

  const contentChannelClaim = getChannelFromClaim(claim);
  const contentChannelPermanentUrl = contentChannelClaim && contentChannelClaim.permanent_url;
  const activeModeratorInfo = activeChannelClaim && moderationDelegatorsById[activeChannelClaim.claim_id];
  const activeChannelIsCreator = activeChannelClaim && activeChannelClaim.permanent_url === contentChannelPermanentUrl;
  const activeChannelIsAdmin = activeChannelClaim && activeModeratorInfo && activeModeratorInfo.global;
  const activeChannelIsModerator =
    activeChannelClaim &&
    contentChannelClaim &&
    activeModeratorInfo &&
    Object.values(activeModeratorInfo.delegators).includes(contentChannelClaim.claim_id);

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

  function assignAsModerator() {
    if (activeChannelClaim && authorUri) {
      const { channelName, channelClaimId } = parseURI(authorUri);
      if (channelName && channelClaimId) commentModAddDelegate(channelClaimId, channelName, activeChannelClaim);
    }
  }

  function getBlockOptionElem() {
    const isPersonalBlockTheOnlyOption = !activeChannelIsModerator && !activeChannelIsAdmin;
    const isTimeoutBlockAvailable = (claim && claim.is_my_output) || activeChannelIsModerator;
    const personalPermanentBlockOnly = isPersonalBlockTheOnlyOption && !isTimeoutBlockAvailable;

    function getSubtitle() {
      if (personalPermanentBlockOnly) {
        return {
          line1: __('Prevent this channel from interacting with you.'),
          line2: null,
        };
      } else {
        if (activeChannelIsModerator && activeChannelIsAdmin) {
          return {
            line1: __('Personal | Moderator | Admin'),
            line2: __('Choose a permanent or temporary ban.'),
          };
        } else if (activeChannelIsModerator && !activeChannelIsAdmin) {
          return {
            line1: __('Personal | Moderator'),
            line2: __('Choose a permanent or temporary ban.'),
          };
        } else if (!activeChannelIsModerator && activeChannelIsAdmin) {
          return {
            line1: __('Personal | Admin'),
            line2: __('Choose a permanent or temporary ban.'),
          };
        } else {
          return {
            line1: null,
            line2: __('Choose a permanent or temporary ban.'),
          };
        }
      }
    }

    const subtitle = getSubtitle();
    return (
      <>
        <div className="menu__link">
          <Icon aria-hidden icon={ICONS.BLOCK} />
          {__('Block')}
        </div>
        {subtitle.line1 && <span className="comment__menu-help">{subtitle.line1}</span>}
        {subtitle.line2 && (
          <span className="comment__menu-help">
            {subtitle.line2} {!personalPermanentBlockOnly && <Icon aria-hidden icon={ICONS.EXTERNAL} />}
          </span>
        )}
      </>
    );
  }

  return (
    <MenuList className="menu__list">
      {activeChannelIsCreator && <div className="comment__menu-title">{__('Creator tools')}</div>}

      {activeChannelIsCreator && isTopLevel && (
        <MenuItem
          className="comment__menu-option menu__link"
          onSelect={() => pinComment(commentId, claim ? claim.claim_id : '', isPinned)}
        >
          <span className={'button__content'}>
            <Icon aria-hidden icon={ICONS.PIN} className={'icon'} />
            {isPinned ? __('Unpin') : __('Pin')}
          </span>
        </MenuItem>
      )}

      {activeChannelIsCreator && activeChannelClaim && activeChannelClaim.permanent_url !== authorUri && (
        <MenuItem className="comment__menu-option" onSelect={assignAsModerator}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.ADD} />
            {__('Add as moderator')}
          </div>
          <span className="comment__menu-help">
            {activeChannelClaim
              ? __('Assign this user to moderate %channel%.', { channel: activeChannelClaim.name })
              : __('Assign this user to moderate your channel.')}
          </span>
        </MenuItem>
      )}

      {commentIsMine && activeChannelClaim && activeChannelClaim.permanent_url === authorUri && !disableEdit && (
        <MenuItem className="comment__menu-option menu__link" onSelect={handleEditComment}>
          <Icon aria-hidden icon={ICONS.EDIT} />
          {__('Edit')}
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

      {!commentIsMine && (
        <>
          <MenuItem
            className="comment__menu-option"
            onSelect={() => openModal(MODALS.BLOCK_CHANNEL, { contentUri: uri, commenterUri: authorUri })}
          >
            {getBlockOptionElem()}
          </MenuItem>
          <MenuItem className="comment__menu-option" onSelect={() => muteChannel(authorUri)}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.MUTE} />
              {__('Mute')}
            </div>
            {activeChannelIsCreator && (
              <span className="comment__menu-help">{__('Hide this channel for you only.')}</span>
            )}
          </MenuItem>
        </>
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
