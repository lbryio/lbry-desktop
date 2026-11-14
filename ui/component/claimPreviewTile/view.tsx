import React from "react";
import classnames from "classnames";
import { NavLink, withRouter } from "react-router-dom";
import FileThumbnail from "component/fileThumbnail";
import UriIndicator from "component/uriIndicator";
import TruncatedText from "component/common/truncated-text";
import DateTime from "component/dateTime";
import ChannelThumbnail from "component/channelThumbnail";
import FileViewCountInline from "component/fileViewCountInline";
import useGetThumbnail from "effects/use-get-thumbnail";
import { formatLbryUrlForWeb, generateListSearchUrlParams } from "util/url";
import { formatClaimPreviewTitle } from "util/formatAriaLabel";
import { parseURI } from "util/lbryURI";
import PreviewOverlayProperties from "component/previewOverlayProperties";
import FileDownloadLink from "component/fileDownloadLink";
import FileWatchLaterLink from "component/fileWatchLaterLink";
import ClaimRepostAuthor from "component/claimRepostAuthor";
import ClaimMenuList from "component/claimMenuList";
import CollectionPreviewOverlay from "component/collectionPreviewOverlay";
// @ts-expect-error - TS2792 - Cannot find module 'static/img/placeholderTx.gif'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import PlaceholderTx from "static/img/placeholderTx.gif";

type Props = {
  uri: string;
  date?: any;
  claim: Claim | null | undefined;
  mediaDuration?: string;
  resolveUri: (arg1: string) => void;
  isResolvingUri: boolean;
  history: {
    push: (arg1: string) => void;
    location: {
      pathname: string;
    };
  };
  thumbnail: string;
  title: string;
  placeholder: boolean;
  banState: {
    blacklisted?: boolean;
    filtered?: boolean;
    muted?: boolean;
    blocked?: boolean;
  };
  getFile: (arg1: string) => void;
  streamingUrl: string;
  isMature: boolean;
  showMature: boolean;
  showHiddenByUser?: boolean;
  properties?: (arg1: Claim) => void;
  collectionId?: string;
  viewCount: string;
  swipeLayout: boolean;
};

// preview image cards used in related video functionality, channel overview page and homepage
function ClaimPreviewTile(props: Props) {
  const {
    history,
    uri,
    date,
    isResolvingUri,
    thumbnail,
    title,
    resolveUri,
    claim,
    placeholder,
    banState,
    getFile,
    streamingUrl,
    isMature,
    showMature,
    showHiddenByUser,
    properties,
    collectionId,
    mediaDuration,
    viewCount,
    swipeLayout = false,
  } = props;
  const isRepost = claim && claim.repost_channel_url;
  const isCollection = claim && claim.value_type === "collection";
  const isStream = claim && claim.value_type === "stream";
  const isPlayable =
    claim &&
    // $FlowFixMe
    claim.value &&
    // $FlowFixMe
    // @ts-expect-error - TS2339 - Property 'stream_type' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'.
    claim.value.stream_type &&
    // $FlowFixMe
    // @ts-expect-error - TS2339 - Property 'stream_type' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'. | TS2339 - Property 'stream_type' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'.
    (claim.value.stream_type === "audio" || claim.value.stream_type === "video");
  const collectionClaimId = isCollection && claim && claim.claim_id;
  const shouldFetch = claim === undefined;
  const thumbnailUrl = useGetThumbnail(uri, claim, streamingUrl, getFile, placeholder) || thumbnail;
  const canonicalUrl = claim && claim.canonical_url;
  const repostedContentUri = claim && (claim.reposted_claim ? claim.reposted_claim.permanent_url : claim.permanent_url);
  const listId = collectionId || collectionClaimId;
  const navigateUrl =
    formatLbryUrlForWeb(canonicalUrl || uri || "/") + (listId ? generateListSearchUrlParams(listId) : "");
  const navLinkProps = {
    to: navigateUrl,
    onClick: (e) => e.stopPropagation(),
  } as const;
  const { location } = history;

  let isValid = false;
  if (uri) {
    try {
      parseURI(uri);
      isValid = true;
    } catch (e: any) {
      isValid = false;
    }
  }

  const signingChannel = claim && claim.signing_channel;
  const isChannel = claim && claim.value_type === "channel";
  const channelUri = !isChannel ? signingChannel && signingChannel.permanent_url : claim && claim.permanent_url;
  const channelTitle = signingChannel && ((signingChannel.value && signingChannel.value.title) || signingChannel.name);

  // Aria-label value for claim preview
  const ariaLabelData = isChannel ? title : formatClaimPreviewTitle(title, channelTitle, date, mediaDuration);

  function handleClick(e: MouseClickEvent) {
    if (navigateUrl) {
      history.push(navigateUrl);
    }
  }

  React.useEffect(() => {
    if (isValid && !isResolvingUri && shouldFetch && uri) {
      resolveUri(uri);
    }
  }, [isValid, isResolvingUri, uri, resolveUri, shouldFetch]);

  let shouldHide = false;

  if (isMature && !showMature) {
    // Unfortunately needed until this is resolved
    // https://github.com/lbryio/lbry-sdk/issues/2785
    shouldHide = true;
  } else {
    shouldHide =
      banState.blacklisted || banState.filtered || (!showHiddenByUser && (banState.muted || banState.blocked));
  }

  if (shouldHide) {
    return null;
  }

  const isChannelPage = location.pathname.startsWith("/@");

  const shouldShowViewCount = !(!viewCount || (claim && claim.repost_url) || !isChannelPage);

  if (placeholder || (!claim && isResolvingUri)) {
    return (
      <li className={classnames("placeholder claim-preview--tile", {})}>
        <div className="media__thumb">
          <img src={PlaceholderTx} alt="Placeholder" />
        </div>
        <div className="placeholder__wrapper">
          <div className="claim-tile__title" />
          <div className="claim-tile__title_b" />
          <div
            className={classnames("claim-tile__info", {
              contains_view_count: shouldShowViewCount,
            })}
          >
            <div className="channel-thumbnail" />
            <div className="claim-tile__about">
              <div className="button__content" />
              <div className="claim-tile__about--counts" />
            </div>
          </div>
        </div>
      </li>
    );
  }

  const liveProperty = null;

  return (
    <li
      onClick={handleClick}
      className={classnames("card claim-preview--tile", {
        "claim-preview__wrapper--channel": isChannel,
        "swipe-list__item claim-preview--horizontal-tile": swipeLayout,
      })}
    >
      <NavLink {...navLinkProps} role="none" tabIndex={-1} aria-hidden>
        <FileThumbnail uri={uri} thumbnail={thumbnailUrl} allowGifs>
          {!isChannel && (
            <React.Fragment>
              <div className="claim-preview__hover-actions">
                {/* @ts-expect-error - TS2741 (ts-migration) */}
                {isPlayable && <FileWatchLaterLink focusable={false} uri={repostedContentUri} />}
              </div>
              {/* @if TARGET='app' */}
              <div className="claim-preview__hover-actions">
                {/* @ts-expect-error - TS2739 (ts-migration) */}
                {isStream && <FileDownloadLink focusable={false} uri={canonicalUrl} hideOpenButton />}
              </div>
              {/* @endif */}

              <div className="claim-preview__file-property-overlay">
                {/* @ts-expect-error - TS2739 (ts-migration) */}
                <PreviewOverlayProperties uri={uri} properties={liveProperty || properties} />
              </div>
            </React.Fragment>
          )}
          {isCollection && (
            <React.Fragment>
              <div className="claim-preview__collection-wrapper">
                <CollectionPreviewOverlay collectionId={listId} uri={uri} />
              </div>
            </React.Fragment>
          )}
        </FileThumbnail>
      </NavLink>
      <div className="claim-tile__header">
        <NavLink aria-label={ariaLabelData} {...navLinkProps}>
          <h2 className="claim-tile__title">
            <TruncatedText text={title || (claim && claim.name)} lines={isChannel ? 1 : 2} />
            {isChannel && (
              <div className="claim-tile__about">
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                <UriIndicator uri={uri} />
              </div>
            )}
          </h2>
        </NavLink>
        {/* @ts-expect-error - TS2322 (ts-migration) */}
        <ClaimMenuList uri={uri} collectionId={listId} channelUri={channelUri} />
      </div>
      <div>
        <div
          className={classnames("claim-tile__info", {
            contains_view_count: shouldShowViewCount,
          })}
        >
          {!isChannel && (
            <React.Fragment>
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <UriIndicator focusable={false} uri={uri} link hideAnonymous>
                {/* @ts-expect-error - TS2322, TS2739 (ts-migration) */}
                <ChannelThumbnail uri={channelUri} xsmall />
              </UriIndicator>

              <div className="claim-tile__about">
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                <UriIndicator uri={uri} link />
                <div className="claim-tile__about--counts">
                  <FileViewCountInline uri={uri} />
                  {/* @ts-expect-error - TS2322 (ts-migration) */}
                  <DateTime timeAgo uri={uri} />
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
        {isRepost && (
          <div className="claim-tile__repost-author">
            {/* @ts-expect-error - TS2741 (ts-migration) */}
            <ClaimRepostAuthor uri={uri} />
          </div>
        )}
      </div>
    </li>
  );
}

export default withRouter(ClaimPreviewTile);
