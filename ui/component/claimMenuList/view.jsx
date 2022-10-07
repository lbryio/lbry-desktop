// @flow
import { URL, SHARE_DOMAIN_URL } from 'config';
import { ChannelPageContext } from 'page/channel/view';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { COL_TYPES } from 'constants/collections';
import React from 'react';
import classnames from 'classnames';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import { COLLECTION_PAGE as CP } from 'constants/urlParams';
import Icon from 'component/common/icon';
import {
  generateShareUrl,
  generateRssUrl,
  generateLbryContentUrl,
  formatLbryUrlForWeb,
  generateListSearchUrlParams,
} from 'util/url';
import { useHistory } from 'react-router';
import { buildURI, parseURI } from 'util/lbryURI';
import ButtonAddToQueue from 'component/buttonAddToQueue';

const SHARE_DOMAIN = SHARE_DOMAIN_URL || URL;

type SubscriptionArgs = {
  channelName: string,
  uri: string,
  notificationsDisabled?: boolean,
};

type Props = {
  uri: string,
  claim: ?Claim,
  repostedClaim: ?Claim,
  contentClaim: ?Claim,
  contentSigningChannel: ?Claim,
  contentChannelUri: string,
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
  doCommentModBlockAsAdmin: (commenterUri: string, offendingCommentId: ?string, blockerId: ?string) => void,
  doCommentModUnBlockAsAdmin: (string, string) => void,
  hasClaimInWatchLater: boolean,
  hasClaimInFavorites: boolean,
  claimInCollection: boolean,
  collectionId: string,
  isMyCollection: boolean,
  isLivestreamClaim?: boolean,
  isPostClaim?: boolean,
  fypId?: string,
  doToast: ({ message: string, isError?: boolean, linkText?: string, linkTarget?: string }) => void,
  claimIsMine: boolean,
  fileInfo: FileListItem,
  prepareEdit: ({}, string, string) => void,
  isSubscribed: boolean,
  doChannelSubscribe: (SubscriptionArgs) => void,
  doChannelUnsubscribe: (SubscriptionArgs) => void,
  hasEdits: Collection,
  isAuthenticated: boolean,
  playNextUri: string,
  resolvedList: boolean,
  fetchCollectionItems: (string) => void,
  doToggleShuffleList: (params: { currentUri?: string, collectionId: string, hideToast?: boolean }) => void,
  lastUsedCollection: ?Collection,
  hasClaimInLastUsedCollection: boolean,
  lastUsedCollectionIsNotBuiltin: boolean,
  doRemovePersonalRecommendation: (uri: string) => void,
  collectionEmpty: boolean,
  doPlaylistAddAndAllowPlaying: (params: {
    uri: string,
    collectionName: string,
    collectionId: string,
    push: (uri: string) => void,
  }) => void,
  isContentProtectedAndLocked: boolean,
};

function ClaimMenuList(props: Props) {
  const {
    uri,
    claim,
    repostedClaim,
    contentClaim,
    contentSigningChannel,
    contentChannelUri,
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
    doCommentModBlockAsAdmin,
    doCommentModUnBlockAsAdmin,
    hasClaimInWatchLater,
    hasClaimInFavorites,
    collectionId,
    isMyCollection,
    isLivestreamClaim,
    isPostClaim,
    fypId,
    doToast,
    claimIsMine,
    fileInfo,
    prepareEdit,
    isSubscribed,
    doChannelSubscribe,
    doChannelUnsubscribe,
    hasEdits,
    isAuthenticated,
    playNextUri,
    resolvedList,
    fetchCollectionItems,
    doToggleShuffleList,
    lastUsedCollection,
    hasClaimInLastUsedCollection,
    lastUsedCollectionIsNotBuiltin,
    doRemovePersonalRecommendation,
    collectionEmpty,
    doPlaylistAddAndAllowPlaying,
    isContentProtectedAndLocked,
  } = props;

  const isChannelPage = React.useContext(ChannelPageContext);

  const {
    push,
    replace,
    location: { search },
  } = useHistory();

  const [doShuffle, setDoShuffle] = React.useState(false);
  const incognitoClaim = contentChannelUri && !contentChannelUri.includes('@');
  const isChannel = !incognitoClaim && !contentSigningChannel;
  const { channelName } = parseURI(contentChannelUri);
  const showDelete = claimIsMine || (fileInfo && (fileInfo.written_bytes > 0 || fileInfo.blobs_completed > 0));
  const subscriptionLabel = repostedClaim
    ? isSubscribed
      ? __('Unfollow @%channelName%', { channelName })
      : __('Follow @%channelName%', { channelName })
    : isSubscribed
    ? __('Unfollow')
    : __('Follow');

  const claimType = isLivestreamClaim ? 'livestream' : isPostClaim ? 'post' : 'upload';

  const fetchItems = React.useCallback(() => {
    if (collectionId) {
      fetchCollectionItems(collectionId);
    }
  }, [collectionId, fetchCollectionItems]);

  React.useEffect(() => {
    if (doShuffle && resolvedList) {
      doToggleShuffleList({ collectionId });
      if (playNextUri) {
        const navigateUrl = formatLbryUrlForWeb(playNextUri);
        push({
          pathname: navigateUrl,
          search: generateListSearchUrlParams(collectionId),
          state: { collectionId, forceAutoplay: true },
        });
      }
    }
  }, [collectionId, doShuffle, doToggleShuffleList, playNextUri, push, resolvedList]);

  if (!claim) {
    return null;
  }

  const lbryUrl: string = generateLbryContentUrl(claim.canonical_url, claim.permanent_url);
  const shareUrl: string = generateShareUrl(SHARE_DOMAIN, lbryUrl);
  const rssUrl: string = isChannel ? generateRssUrl(SHARE_DOMAIN, claim) : '';
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

  function handleAdd(claimIsInPlaylist, name, collectionId) {
    const itemUrl = contentClaim?.canonical_url;

    if (itemUrl) {
      const urlParams = new URLSearchParams(search);
      urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, collectionId);

      doPlaylistAddAndAllowPlaying({
        uri: itemUrl,
        collectionName: name,
        collectionId,
        push: (pushUri) =>
          push({
            pathname: formatLbryUrlForWeb(pushUri),
            search: urlParams.toString(),
            state: { collectionId, forceAutoplay: true },
          }),
      });
    }
  }

  function handleFollow() {
    const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
    if (channelName) {
      subscriptionHandler({
        channelName: '@' + channelName,
        uri: contentChannelUri,
        notificationsDisabled: true,
      });
    }
  }

  function handleToggleMute() {
    if (channelIsMuted) {
      doChannelUnmute(contentChannelUri);
    } else {
      doChannelMute(contentChannelUri);
    }
  }

  function handleToggleBlock() {
    if (channelIsBlocked) {
      doCommentModUnBlock(contentChannelUri);
    } else {
      doCommentModBlock(contentChannelUri);
    }
  }

  function handleEdit() {
    if (!isChannel) {
      const signingChannelName = contentSigningChannel && contentSigningChannel.name;

      const uriObject: LbryUrlObj = {
        streamName: claim.name,
        streamClaimId: claim.claim_id,
      };
      if (signingChannelName) {
        uriObject.channelName = signingChannelName;
      }
      const editUri = buildURI(uriObject);

      prepareEdit(claim, editUri, claimType);
    } else {
      const channelUrl = claim.name + ':' + claim.claim_id;
      push(`/${channelUrl}?${CP.QUERIES.VIEW}=${CP.VIEWS.EDIT}`);
    }
  }

  function handleDelete() {
    if (!repostedClaim && !isChannel) {
      openModal(MODALS.CONFIRM_FILE_REMOVE, { uri, doGoBack: false });
    } else {
      openModal(MODALS.CONFIRM_CLAIM_REVOKE, { claim, cb: isChannel && (() => replace(`/$/${PAGES.CHANNELS}`)) });
    }
  }

  function handleSupport() {
    openModal(MODALS.SEND_TIP, { uri, isSupport: true });
  }

  function handleToggleAdminBlock() {
    if (channelIsAdminBlocked) {
      doCommentModUnBlockAsAdmin(contentChannelUri, '');
    } else {
      doCommentModBlockAsAdmin(contentChannelUri, undefined, undefined);
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
    push(`/$/${PAGES.REPORT_CONTENT}?claimId=${contentClaim && contentClaim.claim_id}`);
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
        {/* FYP */}
        {fypId && (
          <>
            <MenuItem className="comment__menu-option" onSelect={() => doRemovePersonalRecommendation(uri)}>
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.REMOVE} />
                {__('Not interested')}
              </div>
            </MenuItem>
            <hr className="menu__separator" />
          </>
        )}

        <>
          {/* COLLECTION OPERATIONS */}
          {collectionId && isCollectionClaim ? (
            <>
              <MenuItem className="comment__menu-option" onSelect={() => push(`/$/${PAGES.PLAYLIST}/${collectionId}`)}>
                <a className="menu__link" href={`/$/${PAGES.PLAYLIST}/${collectionId}`}>
                  <Icon aria-hidden icon={ICONS.VIEW} />
                  {__('View Playlist')}
                </a>
              </MenuItem>
              {!collectionEmpty && (
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => {
                    if (!resolvedList) fetchItems();
                    setDoShuffle(true);
                  }}
                >
                  <div className="menu__link">
                    <Icon aria-hidden icon={ICONS.SHUFFLE} />
                    {__('Shuffle Play')}
                  </div>
                </MenuItem>
              )}
              {isMyCollection && (
                <>
                  {!collectionEmpty && (
                    <MenuItem
                      className="comment__menu-option"
                      onSelect={() =>
                        push(`/$/${PAGES.PLAYLIST}/${collectionId}?${CP.QUERIES.VIEW}=${CP.VIEWS.PUBLISH}`)
                      }
                    >
                      <div className="menu__link">
                        <Icon aria-hidden iconColor={'red'} icon={ICONS.PUBLISH} />
                        {hasEdits ? __('Publish') : __('Update')}
                      </div>
                    </MenuItem>
                  )}
                  <MenuItem
                    className="comment__menu-option"
                    onSelect={() => push(`/$/${PAGES.PLAYLIST}/${collectionId}?${CP.QUERIES.VIEW}=${CP.VIEWS.EDIT}`)}
                  >
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.EDIT} />
                      {__('Edit')}
                    </div>
                  </MenuItem>
                  <MenuItem
                    className="comment__menu-option"
                    onSelect={() => openModal(MODALS.COLLECTION_DELETE, { collectionId })}
                  >
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.DELETE} />
                      {__('Delete Playlist')}
                    </div>
                  </MenuItem>
                </>
              )}
            </>
          ) : (
            isPlayable && (
              <>
                {/* QUEUE */}
                {contentClaim && <ButtonAddToQueue uri={contentClaim.permanent_url} menuItem />}

                {isAuthenticated && (
                  <>
                    {/* WATCH LATER */}
                    <MenuItem
                      className="comment__menu-option"
                      onSelect={() =>
                        handleAdd(hasClaimInWatchLater, __('Watch Later'), COLLECTIONS_CONSTS.WATCH_LATER_ID)
                      }
                    >
                      <div className="menu__link">
                        <Icon aria-hidden icon={hasClaimInWatchLater ? ICONS.DELETE : ICONS.TIME} />
                        {hasClaimInWatchLater ? __('In Watch Later') : __('Watch Later')}
                      </div>
                    </MenuItem>
                    {/* FAVORITES LIST */}
                    <MenuItem
                      className="comment__menu-option"
                      onSelect={() => handleAdd(hasClaimInFavorites, __('Favorites'), COLLECTIONS_CONSTS.FAVORITES_ID)}
                    >
                      <div className="menu__link">
                        <Icon aria-hidden icon={hasClaimInFavorites ? ICONS.DELETE : ICONS.STAR} />
                        {hasClaimInFavorites ? __('In Favorites') : __('Favorites')}
                      </div>
                    </MenuItem>
                    {/* CURRENTLY ONLY SUPPORT PLAYLISTS FOR PLAYABLE; LATER DIFFERENT TYPES */}
                    <MenuItem
                      className="comment__menu-option"
                      onSelect={() => openModal(MODALS.COLLECTION_ADD, { uri, type: COL_TYPES.PLAYLIST })}
                    >
                      <div className="menu__link">
                        <Icon aria-hidden icon={ICONS.PLAYLIST_ADD} />
                        {__('Add to Playlist')}
                      </div>
                    </MenuItem>
                    {lastUsedCollection && lastUsedCollectionIsNotBuiltin && (
                      <MenuItem
                        className="comment__menu-option"
                        onSelect={() =>
                          handleAdd(hasClaimInLastUsedCollection, lastUsedCollection.name, lastUsedCollection.id)
                        }
                      >
                        <div className="menu__link">
                          {!hasClaimInLastUsedCollection && <Icon aria-hidden icon={ICONS.ADD} />}
                          {hasClaimInLastUsedCollection && <Icon aria-hidden icon={ICONS.DELETE} />}
                          {!hasClaimInLastUsedCollection &&
                            __('Add to %collection%', { collection: lastUsedCollection.name })}
                          {hasClaimInLastUsedCollection &&
                            __('In %collection%', { collection: lastUsedCollection.name })}
                        </div>
                      </MenuItem>
                    )}
                    <hr className="menu__separator" />
                  </>
                )}
              </>
            )
          )}
        </>

        {contentClaim && isContentProtectedAndLocked && !claimIsMine && (
          <MenuItem
            className="comment__menu-option"
            onSelect={() =>
              openModal(MODALS.JOIN_MEMBERSHIP, { uri, fileUri: contentClaim.permanent_url, shouldNavigate: true })
            }
          >
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.MEMBERSHIP} />
              {__('Join')}
            </div>
          </MenuItem>
        )}

        {isAuthenticated && (
          <>
            {!isChannelPage && (
              <>
                <MenuItem className="comment__menu-option" onSelect={handleSupport}>
                  <div className="menu__link">
                    <Icon aria-hidden icon={ICONS.LBC} />
                    {__('Support --[button to support a claim]--')}
                  </div>
                </MenuItem>
              </>
            )}

            {!incognitoClaim && !claimIsMine && !isChannelPage && (
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
                {(!claimIsMine || channelIsBlocked) && contentChannelUri ? (
                  !incognitoClaim && (
                    <>
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
                    {!isChannelPage && !repostedClaim && (
                      <MenuItem className="comment__menu-option" onSelect={handleEdit}>
                        <div className="menu__link">
                          <Icon aria-hidden icon={ICONS.EDIT} />
                          {__('Edit')}
                        </div>
                      </MenuItem>
                    )}
                  </>
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
          </>
        )}

        <MenuItem className="comment__menu-option" onSelect={handleCopyLink}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.COPY_LINK} />
            {__('Copy Link')}
          </div>
        </MenuItem>

        {isChannelPage && IS_WEB && rssUrl && (
          <MenuItem className="comment__menu-option" onSelect={handleCopyRssLink}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.RSS} />
              {__('Copy RSS URL')}
            </div>
          </MenuItem>
        )}

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
