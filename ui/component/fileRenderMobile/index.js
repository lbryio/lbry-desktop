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
import { withRouter } from 'react-router';
import { getChannelIdFromClaim } from 'util/claim';
import { selectActiveLivestreamForChannel } from 'redux/selectors/livestream';
import FileRenderMobile from './view';

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
  };
};

const perform = {
  doPlayUri,
};

export default withRouter(connect(select, perform)(FileRenderMobile));
