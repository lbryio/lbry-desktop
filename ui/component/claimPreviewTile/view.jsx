// @flow
import React from 'react';
import classnames from 'classnames';
import { NavLink, withRouter } from 'react-router-dom';
import FileThumbnail from 'component/fileThumbnail';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import DateTime from 'component/dateTime';
import ChannelThumbnail from 'component/channelThumbnail';
import SubscribeButton from 'component/subscribeButton';
import useGetThumbnail from 'effects/use-get-thumbnail';
import { formatLbryUrlForWeb } from 'util/url';
import { parseURI, COLLECTIONS_CONSTS, isURIEqual } from 'lbry-redux';
import PreviewOverlayProperties from 'component/previewOverlayProperties';
import FileDownloadLink from 'component/fileDownloadLink';
import FileWatchLaterLink from 'component/fileWatchLaterLink';
import ClaimRepostAuthor from 'component/claimRepostAuthor';
import ClaimMenuList from 'component/claimMenuList';
import CollectionPreviewOverlay from 'component/collectionPreviewOverlay';

type Props = {
  uri: string,
  claim: ?Claim,
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
  placeholder: boolean,
  streamingUrl: string,
  isMature: boolean,
  showMature: boolean,
  showHiddenByUser?: boolean,
  properties?: (Claim) => void,
  live?: boolean,
  collectionId?: string,
  showNoSourceClaims?: boolean,
  isLivestream: boolean,
};

function ClaimPreviewTile(props: Props) {
  const {
    history,
    uri,
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
    live,
    showNoSourceClaims,
    isLivestream,
    collectionId,
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
  let navigateUrl = formatLbryUrlForWeb(canonicalUrl || uri || '/');
  const listId = collectionId || collectionClaimId;
  if (listId) {
    const collectionParams = new URLSearchParams();
    collectionParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, listId);
    navigateUrl = navigateUrl + `?` + collectionParams.toString();
  }
  const navLinkProps = {
    to: navigateUrl,
    onClick: (e) => e.stopPropagation(),
  };

  let isChannel;
  let isValid = false;
  if (uri) {
    try {
      ({ isChannel } = parseURI(uri));
      isValid = true;
    } catch (e) {
      isValid = false;
    }
  }

  const signingChannel = claim && claim.signing_channel;
  const channelUri = !isChannel ? signingChannel && signingChannel.permanent_url : claim && claim.permanent_url;

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

  if (placeholder || (!claim && isResolvingUri)) {
    return (
      <li className={classnames('claim-preview--tile', {})}>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-tile__title" />
          <div className="placeholder claim-tile__info" />
        </div>
      </li>
    );
  }

  let liveProperty = null;
  if (live === true) {
    liveProperty = (claim) => <>LIVE</>;
  }

  return (
    <li
      role="link"
      onClick={handleClick}
      className={classnames('card claim-preview--tile', {
        'claim-preview__wrapper--channel': isChannel,
        'claim-preview__live': live,
      })}
    >
      <NavLink {...navLinkProps}>
        <FileThumbnail thumbnail={thumbnailUrl} allowGifs>
          {!isChannel && (
            <React.Fragment>
              {/* @if TARGET='app' */}
              {isStream && (
                <div className="claim-preview__hover-actions">
                  <FileDownloadLink uri={canonicalUrl} hideOpenButton />
                </div>
              )}
              {/* @endif */}

              {isPlayable && (
                <div className="claim-preview__hover-actions">
                  <FileWatchLaterLink uri={uri} />
                </div>
              )}

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
      <NavLink {...navLinkProps}>
        <h2 className="claim-tile__title">
          <TruncatedText text={title || (claim && claim.name)} lines={isChannel ? 1 : 2} />
          {isChannel && (
            <div className="claim-tile__about">
              <UriIndicator uri={uri} />
            </div>
          )}
          {/* CHECK CLAIM MENU LIST PARAMS (IS REPOST?) */}
          <ClaimMenuList uri={uri} collectionId={listId} channelUri={channelUri} isRepost={isRepost} />
        </h2>
      </NavLink>
      <div>
        <div className="claim-tile__info">
          {isChannel ? (
            <div className="claim-tile__about--channel">
              <SubscribeButton uri={uri} />
            </div>
          ) : (
            <React.Fragment>
              <UriIndicator uri={uri} link hideAnonymous>
                <ChannelThumbnail uri={channelUri} xsmall />
              </UriIndicator>

              <div className="claim-tile__about">
                <UriIndicator uri={uri} link />
                <DateTime timeAgo uri={uri} />
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

export default withRouter(ClaimPreviewTile);
