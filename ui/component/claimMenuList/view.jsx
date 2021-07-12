// @flow
import { URL, SHARE_DOMAIN_URL } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import classnames from 'classnames';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';
import { generateShareUrl, generateRssUrl } from 'util/url';
import { useHistory } from 'react-router';
import { buildURI, parseURI, COLLECTIONS_CONSTS } from 'lbry-redux';

const SHARE_DOMAIN = SHARE_DOMAIN_URL || URL;
const PAGE_VIEW_QUERY = `view`;
const EDIT_PAGE = 'edit';

type SubscriptionArgs = {
  channelName: string,
  uri: string,
  notificationsDisabled?: boolean,
};

type Props = {
  uri: string,
  channelUri: string,
  claim: ?Claim,
  openModal: (id: string, {}) => void,
  inline?: boolean,
  channelIsMuted: boolean,
  channelIsBlocked: boolean,
  channelIsAdminBlocked: boolean,
  isAdmin: boolean,
  doChannelMute: (string) => void,
  doChannelUnmute: (string) => void,
  doCommentModBlock: (string) => void,
  doCommentModUnBlock: (string) => void,
  doCommentModBlockAsAdmin: (string, string) => void,
  doCommentModUnBlockAsAdmin: (string, string) => void,
  isRepost: boolean,
  doCollectionEdit: (string, any) => void,
  hasClaimInWatchLater: boolean,
  claimInCollection: boolean,
  collectionName?: string,
  collectionId: string,
  isMyCollection: boolean,
  doToast: ({ message: string, isError?: boolean }) => void,
  claimIsMine: boolean,
  fileInfo: FileListItem,
  prepareEdit: ({}, string, {}) => void,
  isSubscribed: boolean,
  doChannelSubscribe: (SubscriptionArgs) => void,
  doChannelUnsubscribe: (SubscriptionArgs) => void,
  isChannelPage: boolean,
  editedCollection: Collection,
};

function ClaimMenuList(props: Props) {
  const {
    uri,
    channelUri,
    claim,
    openModal,
    inline = false,
    doChannelMute,
    doChannelUnmute,
    channelIsMuted,
    channelIsBlocked,
    channelIsAdminBlocked,
    isAdmin,
    doCommentModBlock,
    doCommentModUnBlock,
    isRepost,
    doCommentModBlockAsAdmin,
    doCommentModUnBlockAsAdmin,
    doCollectionEdit,
    hasClaimInWatchLater,
    collectionId,
    collectionName,
    isMyCollection,
    doToast,
    claimIsMine,
    fileInfo,
    prepareEdit,
    isSubscribed,
    doChannelSubscribe,
    doChannelUnsubscribe,
    isChannelPage = false,
    editedCollection,
  } = props;
  const repostedContent = claim && claim.reposted_claim;
  const contentClaim = repostedContent || claim;
  const incognitoClaim = channelUri && !channelUri.includes('@');
  const signingChannel = claim && (claim.signing_channel || claim);
  const permanentUrl = String(channelUri);
  const isChannel = !incognitoClaim && signingChannel === claim;
  const showDelete = claimIsMine || (fileInfo && (fileInfo.written_bytes > 0 || fileInfo.blobs_completed > 0));
  const subscriptionLabel = isSubscribed ? __('Unfollow') : __('Follow');

  const { push, replace } = useHistory();
  if (!claim) {
    return null;
  }

  const shareUrl: string = generateShareUrl(SHARE_DOMAIN, uri);
  const rssUrl: string = isChannel ? generateRssUrl(URL, claim) : '';
  const isCollectionClaim = claim && claim.value_type === 'collection';
  // $FlowFixMe
  const isPlayable =
    contentClaim &&
    // $FlowFixMe
    contentClaim.value &&
    // $FlowFixMe
    contentClaim.value.stream_type &&
    // $FlowFixMe
    (contentClaim.value.stream_type === 'audio' || contentClaim.value.stream_type === 'video');

  function handleFollow() {
    const { channelName } = parseURI(permanentUrl);
    const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;

    subscriptionHandler({
      channelName: '@' + channelName,
      uri: permanentUrl,
      notificationsDisabled: true,
    });
  }

  function handleToggleMute() {
    if (channelIsMuted) {
      doChannelUnmute(channelUri);
    } else {
      doChannelMute(channelUri);
    }
  }

  function handleToggleBlock() {
    if (channelIsBlocked) {
      doCommentModUnBlock(channelUri);
    } else {
      doCommentModBlock(channelUri);
    }
  }

  function handleEdit() {
    if (!isChannel) {
      const signingChannelName = signingChannel && signingChannel.name;

      const uriObject: { streamName: string, streamClaimId: string, channelName?: string } = {
        streamName: claim.name,
        streamClaimId: claim.claim_id,
      };
      if (signingChannelName) {
        uriObject.channelName = signingChannelName;
      }
      const editUri = buildURI(uriObject);

      push(`/$/${PAGES.UPLOAD}`);
      prepareEdit(claim, editUri, fileInfo);
    } else {
      const channelUrl = claim.name + ':' + claim.claim_id;
      push(`/${channelUrl}?${PAGE_VIEW_QUERY}=${EDIT_PAGE}`);
    }
  }

  function handleDelete() {
    if (!isRepost && !isChannel) {
      openModal(MODALS.CONFIRM_FILE_REMOVE, { uri });
    } else {
      openModal(MODALS.CONFIRM_CLAIM_REVOKE, { claim, cb: !isRepost && (() => replace(`/$/${PAGES.CHANNELS}`)) });
    }
  }

  function handleSupport() {
    openModal(MODALS.SEND_TIP, { uri, isSupport: true });
  }

  function handleToggleAdminBlock() {
    if (channelIsAdminBlocked) {
      doCommentModUnBlockAsAdmin(channelUri, '');
    } else {
      doCommentModBlockAsAdmin(channelUri, '');
    }
  }

  function copyToClipboard(textToCopy, successMsg, failureMsg) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        doToast({ message: __(successMsg) });
      })
      .catch(() => {
        doToast({ message: __(failureMsg), isError: true });
      });
  }

  function handleCopyRssLink() {
    copyToClipboard(rssUrl, 'RSS URL copied.', 'Failed to copy RSS URL.');
  }

  function handleCopyLink() {
    copyToClipboard(shareUrl, 'Link copied.', 'Failed to copy link.');
  }

  function handleReportContent() {
    // $FlowFixMe
    push(`/$/${PAGES.REPORT_CONTENT}?claimId=${(repostedContent && repostedContent.claim_id) || claim.claim_id}`);
  }

  return (
    <Menu>
      <MenuButton
        className={classnames('menu__button', { 'claim__menu-button': !inline, 'claim__menu-button--inline': inline })}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Icon size={20} icon={ICONS.MORE_VERTICAL} />
      </MenuButton>
      <MenuList className="menu__list">
        {/* WATCH LATER */}
        <>
          {isPlayable && !collectionId && (
            <MenuItem
              className="comment__menu-option"
              onSelect={() => {
                doToast({
                  message: __('Item %action% Watch Later', {
                    action: hasClaimInWatchLater
                      ? __('removed from --[substring for "Item %action% Watch Later"]--')
                      : __('added to --[substring for "Item %action% Watch Later"]--'),
                  }),
                });
                doCollectionEdit(COLLECTIONS_CONSTS.WATCH_LATER_ID, {
                  claims: [contentClaim],
                  remove: hasClaimInWatchLater,
                  type: 'playlist',
                });
              }}
            >
              <div className="menu__link">
                <Icon aria-hidden icon={hasClaimInWatchLater ? ICONS.DELETE : ICONS.TIME} />
                {hasClaimInWatchLater ? __('In Watch Later') : __('Watch Later')}
              </div>
            </MenuItem>
          )}
          {/* COLLECTION OPERATIONS */}
          {collectionId && collectionName && isCollectionClaim && (
            <>
              {Boolean(editedCollection) && (
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => push(`/$/${PAGES.LIST}/${collectionId}?view=edit`)}
                >
                  <div className="menu__link">
                    <Icon aria-hidden iconColor={'red'} icon={ICONS.PUBLISH} />
                    {__('Publish')}
                  </div>
                </MenuItem>
              )}
              <MenuItem className="comment__menu-option" onSelect={() => push(`/$/${PAGES.LIST}/${collectionId}`)}>
                <div className="menu__link">
                  <Icon aria-hidden icon={ICONS.VIEW} />
                  {__('View List')}
                </div>
              </MenuItem>
              <MenuItem
                className="comment__menu-option"
                onSelect={() => openModal(MODALS.COLLECTION_DELETE, { collectionId })}
              >
                <div className="menu__link">
                  <Icon aria-hidden icon={ICONS.DELETE} />
                  {__('Delete List')}
                </div>
              </MenuItem>
            </>
          )}
          {/* CURRENTLY ONLY SUPPORT PLAYLISTS FOR PLAYABLE; LATER DIFFERENT TYPES */}
          {isPlayable && (
            <MenuItem
              className="comment__menu-option"
              onSelect={() => openModal(MODALS.COLLECTION_ADD, { uri, type: 'playlist' })}
            >
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.STACK} />
                {__('Add to Lists')}
              </div>
            </MenuItem>
          )}
        </>
        {!isChannelPage && (
          <>
            <hr className="menu__separator" />
            <MenuItem className="comment__menu-option" onSelect={handleSupport}>
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.LBC} />
                {__('Support --[button to support a claim]--')}
              </div>
            </MenuItem>
          </>
        )}

        {!incognitoClaim && !isRepost && !claimIsMine && !isChannelPage && (
          <>
            <hr className="menu__separator" />
            <MenuItem className="comment__menu-option" onSelect={handleFollow}>
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.SUBSCRIBE} />
                {subscriptionLabel}
              </div>
            </MenuItem>
          </>
        )}
        {!isMyCollection && (
          <>
            {(!claimIsMine || channelIsBlocked) && channelUri ? (
              !incognitoClaim &&
              !isRepost && (
                <>
                  <hr className="menu__separator" />
                  <MenuItem className="comment__menu-option" onSelect={handleToggleBlock}>
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.BLOCK} />
                      {channelIsBlocked ? __('Unblock Channel') : __('Block Channel')}
                    </div>
                  </MenuItem>

                  {isAdmin && (
                    <MenuItem className="comment__menu-option" onSelect={handleToggleAdminBlock}>
                      <div className="menu__link">
                        <Icon aria-hidden icon={ICONS.GLOBE} />
                        {channelIsAdminBlocked ? __('Global Unblock Channel') : __('Global Block Channel')}
                      </div>
                    </MenuItem>
                  )}

                  <MenuItem className="comment__menu-option" onSelect={handleToggleMute}>
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.MUTE} />
                      {channelIsMuted ? __('Unmute Channel') : __('Mute Channel')}
                    </div>
                  </MenuItem>
                </>
              )
            ) : (
              <>
                {!isChannelPage && !isRepost && (
                  <MenuItem className="comment__menu-option" onSelect={handleEdit}>
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.EDIT} />
                      {__('Edit')}
                    </div>
                  </MenuItem>
                )}

                {showDelete && (
                  <MenuItem className="comment__menu-option" onSelect={handleDelete}>
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.DELETE} />
                      {__('Delete')}
                    </div>
                  </MenuItem>
                )}
              </>
            )}
          </>
        )}

        <hr className="menu__separator" />

        {isChannelPage && IS_WEB && rssUrl && (
          <MenuItem className="comment__menu-option" onSelect={handleCopyRssLink}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.RSS} />
              {__('Copy RSS URL')}
            </div>
          </MenuItem>
        )}

        <MenuItem className="comment__menu-option" onSelect={handleCopyLink}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.SHARE} />
            {__('Copy Link')}
          </div>
        </MenuItem>

        {!claimIsMine && !isMyCollection && (
          <MenuItem className="comment__menu-option" onSelect={handleReportContent}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.REPORT} />
              {__('Report Content')}
            </div>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default ClaimMenuList;
