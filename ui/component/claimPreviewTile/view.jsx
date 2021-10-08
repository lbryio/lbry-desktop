// @flow
import React from 'react';
import classnames from 'classnames';
import { NavLink, withRouter } from 'react-router-dom';
import FileThumbnail from 'component/fileThumbnail';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import DateTime from 'component/dateTime';
import ChannelThumbnail from 'component/channelThumbnail';
import FileViewCountInline from 'component/fileViewCountInline';
import SubscribeButton from 'component/subscribeButton';
import useGetThumbnail from 'effects/use-get-thumbnail';
import { formatLbryUrlForWeb, generateListSearchUrlParams } from 'util/url';
import { formatClaimPreviewTitle } from 'util/formatAriaLabel';
import { parseURI, isURIEqual } from 'lbry-redux';
import PreviewOverlayProperties from 'component/previewOverlayProperties';
import FileDownloadLink from 'component/fileDownloadLink';
import FileWatchLaterLink from 'component/fileWatchLaterLink';
import ClaimRepostAuthor from 'component/claimRepostAuthor';
import ClaimMenuList from 'component/claimMenuList';
import CollectionPreviewOverlay from 'component/collectionPreviewOverlay';
// $FlowFixMe cannot resolve ...
import PlaceholderTx from 'static/img/placeholderTx.gif';

type Props = {
  uri: string,
  date?: any,
  claim: ?Claim,
  mediaDuration?: string,
  resolveUri: (string) => void,
  isResolvingUri: boolean,
  history: { push: (string) => void },
  thumbnail: string,
  title: string,
  placeholder: boolean,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  filteredOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  blockedChannelUris: Array<string>,
  getFile: (string) => void,
  streamingUrl: string,
  isMature: boolean,
  showMature: boolean,
  showHiddenByUser?: boolean,
  properties?: (Claim) => void,
  collectionId?: string,
  showNoSourceClaims?: boolean,
  isLivestream: boolean,
  viewCount: string,
  isLivestreamActive: boolean,
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
    blackListedOutpoints,
    filteredOutpoints,
    getFile,
    streamingUrl,
    blockedChannelUris,
    isMature,
    showMature,
    showHiddenByUser,
    properties,
    showNoSourceClaims,
    isLivestream,
    isLivestreamActive,
    collectionId,
    mediaDuration,
    viewCount,
  } = props;
  const isRepost = claim && claim.repost_channel_url;
  const isCollection = claim && claim.value_type === 'collection';
  const isStream = claim && claim.value_type === 'stream';
  // $FlowFixMe
  const isPlayable =
    claim &&
    // $FlowFixMe
    claim.value &&
    // $FlowFixMe
    claim.value.stream_type &&
    // $FlowFixMe
    (claim.value.stream_type === 'audio' || claim.value.stream_type === 'video');
  const collectionClaimId = isCollection && claim && claim.claim_id;
  const shouldFetch = claim === undefined;
  const thumbnailUrl = useGetThumbnail(uri, claim, streamingUrl, getFile, placeholder) || thumbnail;
  const canonicalUrl = claim && claim.canonical_url;
  const permanentUrl = claim && claim.permanent_url;
  const listId = collectionId || collectionClaimId;
  const navigateUrl =
    formatLbryUrlForWeb(canonicalUrl || uri || '/') + (listId ? generateListSearchUrlParams(listId) : '');
  const navLinkProps = {
    to: navigateUrl,
    onClick: (e) => e.stopPropagation(),
  };

  let isValid = false;
  if (uri) {
    try {
      parseURI(uri);
      isValid = true;
    } catch (e) {
      isValid = false;
    }
  }

  const signingChannel = claim && claim.signing_channel;
  const isChannel = claim && claim.value_type === 'channel';
  const channelUri = !isChannel ? signingChannel && signingChannel.permanent_url : claim && claim.permanent_url;
  const channelTitle = signingChannel && ((signingChannel.value && signingChannel.value.title) || signingChannel.name);
  const repostedChannelUri = isRepost && isChannel ? permanentUrl || canonicalUrl : undefined;

  // Aria-label value for claim preview
  let ariaLabelData = isChannel ? title : formatClaimPreviewTitle(title, channelTitle, date, mediaDuration);

  function handleClick(e) {
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
  }

  // This will be replaced once blocking is done at the wallet server level
  if (claim && !shouldHide && blackListedOutpoints) {
    shouldHide = blackListedOutpoints.some(
      (outpoint) =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }
  // We're checking to see if the stream outpoint
  // or signing channel outpoint is in the filter list
  if (claim && !shouldHide && filteredOutpoints) {
    shouldHide = filteredOutpoints.some(
      (outpoint) =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }

  // block stream claims
  if (claim && !shouldHide && !showHiddenByUser && blockedChannelUris.length && signingChannel) {
    shouldHide = blockedChannelUris.some((blockedUri) => isURIEqual(blockedUri, signingChannel.permanent_url));
  }
  // block channel claims if we can't control for them in claim search
  // e.g. fetchRecommendedSubscriptions
  if (claim && isChannel && !shouldHide && !showHiddenByUser && blockedChannelUris.length && signingChannel) {
    shouldHide = blockedChannelUris.some((blockedUri) => isURIEqual(blockedUri, signingChannel.permanent_url));
  }

  if (shouldHide || (isLivestream && !showNoSourceClaims)) {
    return null;
  }

  const isChannelPage = window.location.pathname.startsWith('/@');

  const shouldShowViewCount = !(!viewCount || (claim && claim.repost_url) || isLivestream || !isChannelPage);

  if (placeholder || (!claim && isResolvingUri)) {
    return (
      <li className={classnames('claim-preview--tile', {})}>
        <div className="placeholder media__thumb">
          <img src={PlaceholderTx} alt="Placeholder" />
        </div>
        <div className="placeholder__wrapper">
          <div className="placeholder claim-tile__title" />
          <div
            className={classnames('claim-tile__info placeholder', {
              contains_view_count: shouldShowViewCount,
            })}
          />
        </div>
      </li>
    );
  }

  let liveProperty = null;
  if (isLivestreamActive === true) {
    liveProperty = (claim) => <>LIVE</>;
  }

  return (
    <li
      onClick={handleClick}
      className={classnames('card claim-preview--tile', {
        'claim-preview__wrapper--channel': isChannel,
        'claim-preview__live': isLivestreamActive,
      })}
    >
      <NavLink {...navLinkProps} role="none" tabIndex={-1} aria-hidden>
        <FileThumbnail thumbnail={thumbnailUrl} allowGifs>
          {!isChannel && (
            <React.Fragment>
              <div className="claim-preview__hover-actions">
                {isPlayable && <FileWatchLaterLink focusable={false} uri={uri} />}
              </div>
              {/* @if TARGET='app' */}
              <div className="claim-preview__hover-actions">
                {isStream && <FileDownloadLink focusable={false} uri={canonicalUrl} hideOpenButton />}
              </div>
              {/* @endif */}

              <div className="claim-preview__file-property-overlay">
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
                <UriIndicator uri={uri} />
              </div>
            )}
          </h2>
        </NavLink>
        <ClaimMenuList uri={uri} collectionId={listId} channelUri={channelUri} />
      </div>
      <div>
        <div
          className={classnames('claim-tile__info', {
            contains_view_count: shouldShowViewCount,
          })}
        >
          {isChannel ? (
            <div className="claim-tile__about--channel">
              <SubscribeButton uri={repostedChannelUri || uri} />
            </div>
          ) : (
            <React.Fragment>
              <UriIndicator focusable={false} uri={uri} link hideAnonymous>
                <ChannelThumbnail uri={channelUri} xsmall />
              </UriIndicator>

              <div className="claim-tile__about">
                <UriIndicator uri={uri} link />
                <div className="claim-tile__about--counts">
                  <FileViewCountInline uri={uri} isLivestream={isLivestream} />
                  <DateTime timeAgo uri={uri} />
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
        {isRepost && (
          <div className="claim-tile__repost-author">
            <ClaimRepostAuthor uri={uri} />
          </div>
        )}
      </div>
    </li>
  );
}

export default React.memo<Props>(withRouter(ClaimPreviewTile), areEqual);

const BLOCKLIST_KEYS = ['blackListedOutpoints', 'filteredOutpoints', 'blockedChannelUris'];
const HANDLED_KEYS = [...BLOCKLIST_KEYS, 'date'];

function areEqual(prev: Props, next: Props) {
  for (let i = 0; i < BLOCKLIST_KEYS.length; ++i) {
    const key = BLOCKLIST_KEYS[i];
    const a = prev[key];
    const b = next[key];

    if (((!a || !b) && a !== b) || (a && b && a.length !== b.length)) {
      // The arrays are huge, so just compare the length instead of each entry.
      return false;
    }
  }

  if (Number(prev.date) !== Number(next.date)) {
    return false;
  }

  const propKeys = Object.keys(next);
  for (let i = 0; i < propKeys.length; ++i) {
    const pk = propKeys[i];
    if (!HANDLED_KEYS.includes(pk) && prev[pk] !== next[pk]) {
      return false;
    }
  }

  return true;
}
