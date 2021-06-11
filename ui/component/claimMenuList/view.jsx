// @flow
import { URL, SHARE_DOMAIN_URL } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import classnames from 'classnames';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';
import { generateShareUrl } from 'util/url';
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
  doChannelMute: (string) => void,
  doChannelUnmute: (string) => void,
  doCommentModBlock: (string) => void,
  doCommentModUnBlock: (string) => void,
  isRepost: boolean,
  doCollectionEdit: (string, any) => void,
  hasClaimInWatchLater: boolean,
  claimInCollection: boolean,
  collectionName?: string,
  collectionId: string,
  isMyCollection: boolean,
  doToast: ({ message: string }) => void,
  hasExperimentalUi: boolean,
  claimIsMine: boolean,
  fileInfo: FileListItem,
  prepareEdit: ({}, string, {}) => void,
  isSubscribed: boolean,
  doChannelSubscribe: (SubscriptionArgs) => void,
  doChannelUnsubscribe: (SubscriptionArgs) => void,
  isChannelPage: boolean,
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
    doCommentModBlock,
    doCommentModUnBlock,
    isRepost,
    doCollectionEdit,
    hasClaimInWatchLater,
    collectionId,
    collectionName,
    isMyCollection,
    doToast,
    hasExperimentalUi,
    claimIsMine,
    fileInfo,
    prepareEdit,
    isSubscribed,
    doChannelSubscribe,
    doChannelUnsubscribe,
    isChannelPage = false,
  } = props;
  const incognito = channelUri && !(channelUri.includes('@'));
  const signingChannel = claim && (claim.signing_channel || claim);
  const permanentUrl = String(signingChannel && signingChannel.permanent_url);
  const isChannel = !incognito && signingChannel === claim;
  const showDelete = claimIsMine || (fileInfo && (fileInfo.written_bytes > 0 || fileInfo.blobs_completed > 0));
  const subscriptionLabel = isSubscribed ? __('Unfollow') : __('Follow');

  const { push, replace } = useHistory();
  if (!claim) {
    return null;
  }

  const shareUrl: string = generateShareUrl(SHARE_DOMAIN, uri);
  const isCollectionClaim = claim && claim.value_type === 'collection';
  // $FlowFixMe
  const isPlayable =
    claim &&
    !claim.repost_url &&
    // $FlowFixMe
    claim.value.stream_type &&
    // $FlowFixMe
    (claim.value.stream_type === 'audio' || claim.value.stream_type === 'video');

  function handleFollow() {
    const { channelName } = parseURI(permanentUrl);
    const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;

    subscriptionHandler({
      channelName: '@' + channelName,
      uri: permanentUrl,
      notificationsDisabled: true,
    });
  }

  function handleAnalytics() {
    push(`/$/${PAGES.CREATOR_DASHBOARD}?channel=${encodeURIComponent(permanentUrl)}`);
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

      let editUri;
      const uriObject: { streamName: string, streamClaimId: string, channelName?: string } = {
        streamName: claim.name,
        streamClaimId: claim.claim_id,
      };
      if (signingChannelName) {
        uriObject.channelName = signingChannelName;
      }
      editUri = buildURI(uriObject);

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
      openModal(MODALS.CONFIRM_CLAIM_REVOKE, { claim, cb: !isRepost && (() => replace(`/$/${PAGES.CHANNELS}`)), isRepost });
    }
  }

  function handleSupport() {
    openModal(MODALS.SEND_TIP, { uri, isSupport: true });
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl);
  }

  function handleReportContent() {
    push(`/$/${PAGES.REPORT_CONTENT}?claimId=${claim.claim_id}`);
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

        {!incognito && (!claimIsMine ? (!isChannelPage &&
          <MenuItem className="comment__menu-option" onSelect={handleFollow}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.SUBSCRIBE} />
              {subscriptionLabel}
            </div>
          </MenuItem>
        ) : (!isRepost &&
          <MenuItem className="comment__menu-option" onSelect={handleAnalytics}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.ANALYTICS} />
              {__('Channel Analytics')}
            </div>
          </MenuItem>
        ))}

        {!isChannelPage && (
          <MenuItem className="comment__menu-option" onSelect={handleSupport}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.LBC} />
              {__('Support')}
            </div>
          </MenuItem>
          )}

        {hasExperimentalUi && (
          <>
            {/* WATCH LATER */}
            {isPlayable && !collectionId && (
              <>
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => {
                    doToast({
                      message: __('Item %action% Watch Later', {
                        action: hasClaimInWatchLater ? __('removed from') : __('added to'),
                      }),
                    });
                    doCollectionEdit(COLLECTIONS_CONSTS.WATCH_LATER_ID, {
                      claims: [claim],
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
              </>
            )}
            {/* COLLECTION OPERATIONS */}
            {collectionId && collectionName && isCollectionClaim && (
              <>
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
            <hr className="menu__separator" />
          </>
        )}

        {(!claimIsMine || channelIsBlocked) && channelUri && !isMyCollection ? !incognito && (
          <>
            <MenuItem className="comment__menu-option" onSelect={handleToggleBlock}>
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.BLOCK} />
                {channelIsBlocked ? __('Unblock Channel') : __('Block Channel')}
              </div>
            </MenuItem>

            <MenuItem className="comment__menu-option" onSelect={handleToggleMute}>
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.MUTE} />
                {channelIsMuted ? __('Unmute Channel') : __('Mute Channel')}
              </div>
            </MenuItem>
          </>
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
        <hr className="menu__separator" />

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
