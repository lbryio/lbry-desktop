import { connect } from 'react-redux';
import { selectTitleForUri, makeSelectClaimWasPurchased, selectClaimForUri } from 'redux/selectors/claims';
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
import { doUriInitiatePlay, doSetPlayingUri } from 'redux/actions/content';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { withRouter } from 'react-router';
import { getChannelIdFromClaim } from 'util/claim';
import { selectMobilePlayerDimensions } from 'redux/selectors/app';
import { selectIsActiveLivestreamForUri } from 'redux/selectors/livestream';
import { doSetMobilePlayerDimensions } from 'redux/actions/app';
import FileRenderFloating from './view';

const select = (state, props) => {
  const { location } = props;

  const playingUri = selectPlayingUri(state);
  const { uri, collectionId } = playingUri || {};

  const claim = selectClaimForUri(state, uri);

  return {
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
    claimWasPurchased: makeSelectClaimWasPurchased(uri)(state),
    nextListUri: collectionId && makeSelectNextUrlForCollectionAndUrl(collectionId, uri)(state),
    previousListUri: collectionId && makeSelectPreviousUrlForCollectionAndUrl(collectionId, uri)(state),
    collectionId,
    isCurrentClaimLive: selectIsActiveLivestreamForUri(state, uri),
    channelClaimId: claim && getChannelIdFromClaim(claim),
    mobilePlayerDimensions: selectMobilePlayerDimensions(state),
  };
};

const perform = {
  doFetchRecommendedContent,
  doUriInitiatePlay,
  doSetPlayingUri,
  doSetMobilePlayerDimensions,
};

export default withRouter(connect(select, perform)(FileRenderFloating));
