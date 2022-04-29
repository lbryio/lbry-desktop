import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectTitleForUri,
  selectClaimWasPurchasedForUri,
  selectGeoRestrictionForUri,
} from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import {
  makeSelectNextUrlForCollectionAndUrl,
  makeSelectPreviousUrlForCollectionAndUrl,
} from 'redux/selectors/collections';
import * as SETTINGS from 'constants/settings';
import {
  makeSelectIsPlayerFloating,
  selectPrimaryUri,
  selectPlayingUri,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectCostInfoForUri } from 'lbryinc';
import { doUriInitiatePlay, doSetPlayingUri, doClearPlayingUri } from 'redux/actions/content';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { withRouter } from 'react-router';
import { selectAppDrawerOpen } from 'redux/selectors/app';
import { selectIsActiveLivestreamForUri, selectSocketConnectionForId } from 'redux/selectors/livestream';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { isStreamPlaceholderClaim, getVideoClaimAspectRatio } from 'util/claim';
import FileRenderFloating from './view';

const select = (state, props) => {
  const { location } = props;

  const playingUri = selectPlayingUri(state);
  const { uri, collectionId } = playingUri || {};

  const claim = uri && selectClaimForUri(state, uri);
  const { claim_id: claimId, signing_channel: channelClaim } = claim || {};
  const { canonical_url: channelUrl } = channelClaim || {};

  return {
    claimId,
    channelUrl,
    uri,
    playingUri,
    primaryUri: selectPrimaryUri(state),
    title: selectTitleForUri(state, uri),
    isFloating: makeSelectIsPlayerFloating(location)(state),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    floatingPlayerEnabled: selectClientSetting(state, SETTINGS.FLOATING_PLAYER),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    videoTheaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
    costInfo: selectCostInfoForUri(state, uri),
    claimWasPurchased: selectClaimWasPurchasedForUri(state, uri),
    nextListUri: collectionId && makeSelectNextUrlForCollectionAndUrl(collectionId, uri)(state),
    previousListUri: collectionId && makeSelectPreviousUrlForCollectionAndUrl(collectionId, uri)(state),
    collectionId,
    isCurrentClaimLive: selectIsActiveLivestreamForUri(state, uri),
    videoAspectRatio: getVideoClaimAspectRatio(claim),
    socketConnection: selectSocketConnectionForId(state, claimId),
    isLivestreamClaim: isStreamPlaceholderClaim(claim),
    geoRestriction: selectGeoRestrictionForUri(state, uri),
    appDrawerOpen: selectAppDrawerOpen(state),
  };
};

const perform = {
  doFetchRecommendedContent,
  doUriInitiatePlay,
  doSetPlayingUri,
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doClearPlayingUri,
};

export default withRouter(connect(select, perform)(FileRenderFloating));
