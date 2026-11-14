import { URL, SHARE_DOMAIN_URL } from "config";
import * as ICONS from "constants/icons";
import * as PAGES from "constants/pages";
import * as MODALS from "constants/modal_types";
import * as COLLECTIONS_CONSTS from "constants/collections";
import React from "react";
import classnames from "classnames";
import { Menu, MenuButton, MenuList, MenuItem } from "@reach/menu-button";
import Icon from "component/common/icon";
import { generateShareUrl, generateLbryContentUrl, formatLbryUrlForWeb, generateListSearchUrlParams } from "util/url";
import { useHistory } from "react-router";
import { buildURI, parseURI } from "util/lbryURI";

const SHARE_DOMAIN = SHARE_DOMAIN_URL || URL;
const PAGE_VIEW_QUERY = "view";
const EDIT_PAGE = "edit";

type SubscriptionArgs = {
  channelName: string;
  uri: string;
  notificationsDisabled?: boolean;
};

type Props = {
  uri: string;
  claim: Claim | null | undefined;
  repostedClaim: Claim | null | undefined;
  contentClaim: Claim | null | undefined;
  contentSigningChannel: Claim | null | undefined;
  contentChannelUri: string;
  openModal: (id: string, arg2: Record<any, any>) => void;
  inline?: boolean;
  channelIsMuted: boolean;
  channelIsBlocked: boolean;
  channelIsAdminBlocked: boolean;
  isAdmin: boolean;
  doChannelMute: (arg1: string) => void;
  doChannelUnmute: (arg1: string) => void;
  doCommentModBlock: (arg1: string) => void;
  doCommentModUnBlock: (arg1: string) => void;
  doCommentModBlockAsAdmin: (arg1: string, arg2?: string | null | undefined, arg3?: string | null | undefined) => void;
  doCommentModUnBlockAsAdmin: (arg1: string, arg2: string) => void;
  doCollectionEdit: (arg1: string, arg2?: any) => void;
  hasClaimInWatchLater: boolean;
  hasClaimInFavorites: boolean;
  claimInCollection: boolean;
  collectionId: string;
  isMyCollection: boolean;
  doToast: (arg1: { message: string; isError?: boolean }) => void;
  claimIsMine: boolean;
  fileInfo: FileListItem;
  openFolder: (path: string) => void;
  prepareEdit: (arg1: Record<any, any>, arg2: string, arg3: Record<any, any>) => void;
  isSubscribed: boolean;
  doChannelSubscribe: (arg1: SubscriptionArgs) => void;
  doChannelUnsubscribe: (arg1: SubscriptionArgs) => void;
  isChannelPage: boolean;
  editedCollection: Collection;
  playNextUri: string;
  resolvedList: boolean;
  fetchCollectionItems: (arg1: string) => void;
  doToggleShuffleList: (arg1: string) => void;
  lastUsedCollection: Collection | null | undefined;
  hasClaimInLastUsedCollection: boolean;
  lastUsedCollectionIsNotBuiltin: boolean;
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
    doCollectionEdit,
    hasClaimInWatchLater,
    hasClaimInFavorites,
    collectionId,
    isMyCollection,
    doToast,
    claimIsMine,
    fileInfo,
    openFolder,
    prepareEdit,
    isSubscribed,
    doChannelSubscribe,
    doChannelUnsubscribe,
    isChannelPage = false,
    editedCollection,
    playNextUri,
    resolvedList,
    fetchCollectionItems,
    doToggleShuffleList,
    lastUsedCollection,
    hasClaimInLastUsedCollection,
    lastUsedCollectionIsNotBuiltin,
  } = props;
  const [doShuffle, setDoShuffle] = React.useState(false);
  const incognitoClaim = contentChannelUri && !contentChannelUri.includes("@");
  const isChannel = !incognitoClaim && !contentSigningChannel;
  // @ts-expect-error - TS2339 - Property 'claims' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'. | TS2339 - Property 'claims' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'.
  const claimLength = claim && claim.value && claim.value.claims && claim.value.claims.length;
  const claimCount = editedCollection ? editedCollection.items.length : claimLength;
  const isEmptyCollection = (Number(claimCount) || 0) <= 0;
  const { channelName } = parseURI(contentChannelUri);
  const showDelete = claimIsMine || (fileInfo && (fileInfo.written_bytes > 0 || fileInfo.blobs_completed > 0));
  const subscriptionLabel = repostedClaim
    ? isSubscribed
      ? __("Unfollow @%channelName%", { channelName })
      : __("Follow @%channelName%", { channelName })
    : isSubscribed
      ? __("Unfollow")
      : __("Follow");

  const { push, replace } = useHistory();

  const fetchItems = React.useCallback(() => {
    if (collectionId) {
      fetchCollectionItems(collectionId);
    }
  }, [collectionId, fetchCollectionItems]);

  React.useEffect(() => {
    if (doShuffle && resolvedList) {
      doToggleShuffleList(collectionId);
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
  // @ts-expect-error - TS2554 - Expected 7 arguments, but got 2.
  const shareUrl: string = generateShareUrl(SHARE_DOMAIN, lbryUrl);
  const isCollectionClaim = claim && claim.value_type === "collection";
  const isPlayable =
    contentClaim &&
    // $FlowFixMe
    contentClaim.value &&
    // $FlowFixMe
    // @ts-expect-error - TS2339 - Property 'stream_type' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'.
    contentClaim.value.stream_type &&
    // $FlowFixMe
    // @ts-expect-error - TS2339 - Property 'stream_type' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'. | TS2339 - Property 'stream_type' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'.
    (contentClaim.value.stream_type === "audio" || contentClaim.value.stream_type === "video");

  function handleAdd(source: unknown, name: unknown, collectionId: unknown) {
    doToast({
      message: source ? __("Item removed from %name%", { name }) : __("Item added to %name%", { name }),
    });
    if (contentClaim) {
      // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
      doCollectionEdit(collectionId, { uris: [contentClaim.permanent_url], remove: source, type: "playlist" });
    }
  }

  function handleFollow() {
    const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
    if (channelName) {
      subscriptionHandler({
        channelName: "@" + channelName,
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

      push(`/$/${PAGES.UPLOAD}`);
      prepareEdit(claim, editUri, fileInfo);
    } else {
      const channelUrl = claim.name + ":" + claim.claim_id;
      push(`/${channelUrl}?${PAGE_VIEW_QUERY}=${EDIT_PAGE}`);
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
      doCommentModUnBlockAsAdmin(contentChannelUri, "");
    } else {
      doCommentModBlockAsAdmin(contentChannelUri, undefined, undefined);
    }
  }

  function copyToClipboard(textToCopy: unknown, successMsg: unknown, failureMsg: unknown) {
    navigator.clipboard
      // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
      .writeText(textToCopy)
      .then(() => {
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
        doToast({ message: __(successMsg) });
      })
      .catch(() => {
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
        doToast({ message: __(failureMsg), isError: true });
      });
  }

  function handleCopyLink() {
    copyToClipboard(shareUrl, "Link copied.", "Failed to copy link.");
  }

  function handleReportContent() {
    push(`/$/${PAGES.REPORT_CONTENT}?claimId=${contentClaim && contentClaim.claim_id}`);
  }

  // changes MenuButton behavior to show/hide MenuList not on press but on click event
  let isEventSimulated = false;
  const menuButtonHandler = (e: MouseClickEvent | KeyEvent) => {
    // @ts-expect-error - TS2339 - Property 'key' does not exist on type 'unknown'.
    if (e.key === "Enter") {
      e.preventDefault();
      e.type = "click";
    }
    if (!isEventSimulated && e.type === "mousedown") {
      e.preventDefault();
    } else if (e.type === "click") {
      isEventSimulated = true;
      e.target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      isEventSimulated = false;
    }
  };

  return (
    <Menu>
      <MenuButton
        className={classnames("menu__button", { "claim__menu-button": !inline, "claim__menu-button--inline": inline })}
        onMouseDown={menuButtonHandler}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          menuButtonHandler(e);
        }}
        onKeyDown={menuButtonHandler}
      >
        <Icon size={20} icon={ICONS.MORE_VERTICAL} />
      </MenuButton>
      <MenuList className="menu__list">
        <>
          {/* COLLECTION OPERATIONS */}
          {collectionId && isCollectionClaim ? (
            <>
              <MenuItem className="comment__menu-option" onSelect={() => push(`/$/${PAGES.LIST}/${collectionId}`)}>
                <a className="menu__link" href={`/$/${PAGES.LIST}/${collectionId}`}>
                  <Icon aria-hidden icon={ICONS.VIEW} />
                  {__("View List")}
                </a>
              </MenuItem>
              {!isEmptyCollection && (
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => {
                    if (!resolvedList) fetchItems();
                    setDoShuffle(true);
                  }}
                >
                  <div className="menu__link">
                    <Icon aria-hidden icon={ICONS.SHUFFLE} />
                    {__("Shuffle Play")}
                  </div>
                </MenuItem>
              )}
              {isMyCollection && (
                <>
                  <MenuItem
                    className="comment__menu-option"
                    onSelect={() => push(`/$/${PAGES.LIST}/${collectionId}?view=edit`)}
                  >
                    <div className="menu__link">
                      <Icon aria-hidden iconColor={"red"} icon={ICONS.PUBLISH} />
                      {editedCollection ? __("Publish") : __("Edit List")}
                    </div>
                  </MenuItem>
                  <MenuItem
                    className="comment__menu-option"
                    onSelect={() => openModal(MODALS.COLLECTION_DELETE, { collectionId })}
                  >
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.DELETE} />
                      {__("Delete List")}
                    </div>
                  </MenuItem>
                </>
              )}
            </>
          ) : (
            isPlayable && (
              <>
                {/* WATCH LATER */}
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => handleAdd(hasClaimInWatchLater, __("Watch Later"), COLLECTIONS_CONSTS.WATCH_LATER_ID)}
                >
                  <div className="menu__link">
                    <Icon aria-hidden icon={hasClaimInWatchLater ? ICONS.DELETE : ICONS.TIME} />
                    {hasClaimInWatchLater ? __("In Watch Later") : __("Watch Later")}
                  </div>
                </MenuItem>
                {/* FAVORITES LIST */}
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => handleAdd(hasClaimInFavorites, __("Favorites"), COLLECTIONS_CONSTS.FAVORITES_ID)}
                >
                  <div className="menu__link">
                    <Icon aria-hidden icon={hasClaimInFavorites ? ICONS.DELETE : ICONS.STAR} />
                    {hasClaimInFavorites ? __("In Favorites") : __("Favorites")}
                  </div>
                </MenuItem>
                {/* CURRENTLY ONLY SUPPORT PLAYLISTS FOR PLAYABLE; LATER DIFFERENT TYPES */}
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => openModal(MODALS.COLLECTION_ADD, { uri, type: "playlist" })}
                >
                  <div className="menu__link">
                    <Icon aria-hidden icon={ICONS.STACK} />
                    {__("Add to Lists")}
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
                        __("Add to %collection%", { collection: lastUsedCollection.name })}
                      {hasClaimInLastUsedCollection && __("In %collection%", { collection: lastUsedCollection.name })}
                    </div>
                  </MenuItem>
                )}
                <hr className="menu__separator" />
              </>
            )
          )}
        </>
        {!isChannelPage && (
          <>
            <MenuItem className="comment__menu-option" onSelect={handleSupport}>
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.LBC} />
                {__("Support --[button to support a claim]--")}
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
                  <hr className="menu__separator" />
                  <MenuItem className="comment__menu-option" onSelect={handleToggleBlock}>
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.BLOCK} />
                      {channelIsBlocked ? __("Unblock Channel") : __("Block Channel")}
                    </div>
                  </MenuItem>

                  {isAdmin && (
                    <MenuItem className="comment__menu-option" onSelect={handleToggleAdminBlock}>
                      <div className="menu__link">
                        <Icon aria-hidden icon={ICONS.GLOBE} />
                        {channelIsAdminBlocked ? __("Global Unblock Channel") : __("Global Block Channel")}
                      </div>
                    </MenuItem>
                  )}

                  <MenuItem className="comment__menu-option" onSelect={handleToggleMute}>
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.MUTE} />
                      {channelIsMuted ? __("Unmute Channel") : __("Mute Channel")}
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
                      {__("Edit")}
                    </div>
                  </MenuItem>
                )}
              </>
            )}

            {fileInfo && fileInfo.download_path && (
              <MenuItem className="comment__menu-option" onSelect={() => openFolder(fileInfo.download_path)}>
                <div className="menu__link">
                  <Icon aria-hidden icon={ICONS.OPEN_LOG_FOLDER} />
                  {__("Open in Folder")}
                </div>
              </MenuItem>
            )}
            {showDelete && (
              <MenuItem className="comment__menu-option" onSelect={handleDelete}>
                <div className="menu__link">
                  <Icon aria-hidden icon={ICONS.DELETE} />
                  {__("Delete")}
                </div>
              </MenuItem>
            )}
          </>
        )}
        <hr className="menu__separator" />
        <MenuItem className="comment__menu-option" onSelect={handleCopyLink}>
          <div className="menu__link">
            <Icon aria-hidden icon={ICONS.COPY_LINK} />
            {__("Copy Link")}
          </div>
        </MenuItem>
        {!claimIsMine && !isMyCollection && (
          <MenuItem className="comment__menu-option" onSelect={handleReportContent}>
            <div className="menu__link">
              <Icon aria-hidden icon={ICONS.REPORT} />
              {__("Report Content")}
            </div>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default ClaimMenuList;
