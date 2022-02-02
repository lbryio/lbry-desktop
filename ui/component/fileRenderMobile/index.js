import { connect } from 'react-redux';
import { makeSelectClaimWasPurchased, selectClaimForUri } from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import {
  makeSelectNextUrlForCollectionAndUrl,
  makeSelectPreviousUrlForCollectionAndUrl,
} from 'redux/selectors/collections';
import { selectPlayingUri, makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { selectCostInfoForUri } from 'lbryinc';
import { doPlayUri } from 'redux/actions/content';
import { doSetMobilePlayerDimensions } from 'redux/actions/app';
import { withRouter } from 'react-router';
import { getChannelIdFromClaim } from 'util/claim';
import { selectActiveLivestreamForChannel } from 'redux/selectors/livestream';
import FileRenderMobile from './view';
import { selectMobilePlayerDimensions } from 'redux/selectors/app';

const select = (state, props) => {
  const playingUri = selectPlayingUri(state);
  const uri = playingUri && playingUri.uri;
  const collectionId = playingUri && playingUri.collectionId;

  const claim = selectClaimForUri(state, uri);
  const claimId = claim && claim.claim_id;
  const channelClaimId = claim && getChannelIdFromClaim(claim);

  return {
    uri,
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    costInfo: selectCostInfoForUri(state, uri),
    claimWasPurchased: makeSelectClaimWasPurchased(uri)(state),
    nextListUri: collectionId && makeSelectNextUrlForCollectionAndUrl(collectionId, uri)(state),
    previousListUri: collectionId && makeSelectPreviousUrlForCollectionAndUrl(collectionId, uri)(state),
    collectionId,
    activeLivestreamForChannel: channelClaimId && selectActiveLivestreamForChannel(state, channelClaimId),
    claimId,
    channelClaimId,
    mobilePlayerDimensions: selectMobilePlayerDimensions(state),
    playingUri,
  };
};

const perform = {
  doPlayUri,
  doSetMobilePlayerDimensions,
};

export default withRouter(connect(select, perform)(FileRenderMobile));
