import { connect } from 'react-redux';
import { selectTitleForUri, selectClaimIsNsfwForUri, makeSelectClaimWasPurchased } from 'redux/selectors/claims';
import { makeSelectFileInfoForUri, makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
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
import { doPlayUri, doSetPlayingUri } from 'redux/actions/content';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { doAnaltyicsPurchaseEvent } from 'redux/actions/app';
import { withRouter } from 'react-router';
import FileRenderFloating from './view';

const select = (state, props) => {
  const playingUri = selectPlayingUri(state);
  const primaryUri = selectPrimaryUri(state);
  const uri = playingUri && playingUri.uri;
  const collectionId = playingUri && playingUri.collectionId;

  return {
    uri,
    primaryUri,
    playingUri,
    title: selectTitleForUri(state, uri),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    mature: selectClaimIsNsfwForUri(state, uri),
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    floatingPlayerEnabled: selectClientSetting(state, SETTINGS.FLOATING_PLAYER),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    videoTheaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
    costInfo: selectCostInfoForUri(state, uri),
    claimWasPurchased: makeSelectClaimWasPurchased(uri)(state),
    nextListUri: collectionId && makeSelectNextUrlForCollectionAndUrl(collectionId, uri)(state),
    previousListUri: collectionId && makeSelectPreviousUrlForCollectionAndUrl(collectionId, uri)(state),
    collectionId,
  };
};

const perform = (dispatch) => ({
  closeFloatingPlayer: () => dispatch(doSetPlayingUri({ uri: null })),
  doFetchRecommendedContent: (uri, mature) => dispatch(doFetchRecommendedContent(uri, mature)),
  doPlayUri: (uri, collectionId, hideFailModal) =>
    dispatch(
      doPlayUri(
        uri,
        false,
        false,
        (fileInfo) => {
          dispatch(doAnaltyicsPurchaseEvent(fileInfo));
        },
        hideFailModal
      ),
      dispatch(doSetPlayingUri({ uri, collectionId }))
    ),
  clearSecondarySource: (uri) => dispatch(doSetPlayingUri({ uri })),
});

export default withRouter(connect(select, perform)(FileRenderFloating));
