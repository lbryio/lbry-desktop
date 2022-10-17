import { connect } from 'react-redux';
import EmbedWrapperPage from './view';
import * as PAGES from 'constants/pages';
import {
  selectClaimForUri,
  selectIsUriResolving,
  selectGeoRestrictionForUri,
  selectLatestClaimForUri,
  selectIsFiatRequiredForUri,
} from 'redux/selectors/claims';
import { selectStreamingUrlForUri } from 'redux/selectors/file_info';
import { doResolveUri, doFetchLatestClaimForChannel } from 'redux/actions/claims';
import { buildURI, normalizeURI } from 'util/lbryURI';
import { doPlayUri } from 'redux/actions/content';
import { selectShouldObscurePreviewForUri } from 'redux/selectors/content';
import { selectCostInfoForUri, doFetchCostInfoForUri, selectBlackListedOutpoints } from 'lbryinc';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { doFetchActiveLivestreams, doFetchChannelLiveStatus } from 'redux/actions/livestream';
import {
  selectIsActiveLivestreamForUri,
  selectActiveLivestreamInitialized,
  selectActiveLiveClaimForChannel,
} from 'redux/selectors/livestream';
import { getThumbnailFromClaim, isStreamPlaceholderClaim, getChannelFromClaim } from 'util/claim';
import { selectNoRestrictionOrUserIsMemberForContentClaimId } from 'redux/selectors/memberships';

const select = (state, props) => {
  const { search } = state.router.location;
  const { match } = props || {};

  let uri, claimId;
  if (match) {
    const { claimName, claimId } = match.params;

    uri = claimName
      ? claimName.includes(':') && claimId
        ? normalizeURI(claimName + '/' + claimId)
        : buildURI({ claimName, claimId })
      : '';
  }

  const urlParams = new URLSearchParams(search);
  const featureParam = urlParams.get('feature');
  const isNewestPath = featureParam === PAGES.LIVE_NOW || featureParam === PAGES.LATEST;

  const claim = selectClaimForUri(state, uri);
  const { canonical_url: canonicalUrl, txid, nout } = claim || {};
  if (!claimId) claimId = claim?.claim_id;

  const channelClaim = getChannelFromClaim(claim);
  const { claim_id: channelClaimId, canonical_url: channelUri, txid: channelTxid, channelNout } = channelClaim || {};
  const haveClaim = Boolean(claim);
  const nullClaim = claim === null;

  const latestContentClaim =
    featureParam === PAGES.LIVE_NOW
      ? selectActiveLiveClaimForChannel(state, channelClaimId)
      : selectLatestClaimForUri(state, canonicalUrl);
  const latestClaimUrl = latestContentClaim && latestContentClaim.canonical_url;
  const latestClaimId = latestContentClaim && latestContentClaim.claim_id;

  if (latestClaimUrl) uri = latestClaimUrl;
  if (latestClaimId & (featureParam === PAGES.LIVE_NOW)) claimId = latestClaimId;

  return {
    uri,
    claimId,
    haveClaim,
    nullClaim,
    canonicalUrl,
    txid,
    nout,
    channelUri,
    channelClaimId,
    channelTxid,
    channelNout,
    latestClaimUrl,
    isNewestPath,
    isFiatRequired: selectIsFiatRequiredForUri(state, uri),
    costInfo: uri && selectCostInfoForUri(state, uri),
    streamingUrl: selectStreamingUrlForUri(state, uri),
    isResolvingUri: uri && selectIsUriResolving(state, uri),
    blackListedOutpoints: haveClaim && selectBlackListedOutpoints(state),
    isCurrentClaimLive: selectIsActiveLivestreamForUri(state, isNewestPath ? latestClaimUrl : canonicalUrl),
    isLivestreamClaim: featureParam === PAGES.LIVE_NOW || isStreamPlaceholderClaim(claim),
    obscurePreview: selectShouldObscurePreviewForUri(state, uri),
    claimThumbnail: getThumbnailFromClaim(claim),
    activeLivestreamInitialized: selectActiveLivestreamInitialized(state),
    geoRestriction: selectGeoRestrictionForUri(state, uri),
    contentUnlocked: claim && selectNoRestrictionOrUserIsMemberForContentClaimId(state, claim.claim_id),
  };
};

const perform = {
  doResolveUri,
  doPlayUri,
  doFetchCostInfoForUri,
  doFetchChannelLiveStatus,
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doFetchActiveLivestreams,
  fetchLatestClaimForChannel: doFetchLatestClaimForChannel,
};

export default connect(select, perform)(EmbedWrapperPage);
