import { connect } from 'react-redux';
import EmbedWrapperPage from './view';
import * as PAGES from 'constants/pages';
import {
  selectClaimForUri,
  selectIsUriResolving,
  selectGeoRestrictionForUri,
  selectLatestClaimForUri,
} from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
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
      ? selectActiveLiveClaimForChannel(state, claimId)
      : selectLatestClaimForUri(state, canonicalUrl);
  const latestClaimUrl = latestContentClaim && latestContentClaim.canonical_url;
  if (latestClaimUrl) uri = latestClaimUrl;

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
    costInfo: uri && selectCostInfoForUri(state, uri),
    streamingUrl: uri && makeSelectStreamingUrlForUri(uri)(state),
    isResolvingUri: uri && selectIsUriResolving(state, uri),
    blackListedOutpoints: haveClaim && selectBlackListedOutpoints(state),
    isCurrentClaimLive: selectIsActiveLivestreamForUri(state, isNewestPath ? latestClaimUrl : canonicalUrl),
    isLivestreamClaim: featureParam === PAGES.LIVE_NOW || isStreamPlaceholderClaim(claim),
    obscurePreview: selectShouldObscurePreviewForUri(state, uri),
    claimThumbnail: getThumbnailFromClaim(claim),
    activeLivestreamInitialized: selectActiveLivestreamInitialized(state),
    geoRestriction: selectGeoRestrictionForUri(state, uri),
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
