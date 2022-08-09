import { connect } from 'react-redux';
import { doPlayUri, doSetPlayingUri, doSetPrimaryUri } from 'redux/actions/content';
import { selectThumbnailForUri, makeSelectClaimForUri, makeSelectClaimWasPurchased } from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import * as SETTINGS from 'constants/settings';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { selectCostInfoForUri } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { withRouter } from 'react-router';
import {
  makeSelectIsPlaying,
  selectShouldObscurePreviewForUri,
  selectInsufficientCreditsForUri,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import FileRenderInitiator from './view';
import { doAnaltyicsPurchaseEvent } from 'redux/actions/app';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  return {
    claimThumbnail: selectThumbnailForUri(state, props.uri),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    obscurePreview: selectShouldObscurePreviewForUri(state, props.uri),
    isPlaying: makeSelectIsPlaying(props.uri)(state),
    insufficientCredits: selectInsufficientCreditsForUri(state, props.uri),
    autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY_MEDIA)(state),
    costInfo: selectCostInfoForUri(state, props.uri),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
    collectionId,
  };
};

const perform = (dispatch) => ({
  play: (uri, collectionId, isPlayable) => {
    dispatch(doSetPrimaryUri(uri));
    if (isPlayable) dispatch(doSetPlayingUri({ uri, collectionId }));
    dispatch(doPlayUri(uri, undefined, undefined, (fileInfo) => dispatch(doAnaltyicsPurchaseEvent(fileInfo))));
  },
});

export default withRouter(connect(select, perform)(FileRenderInitiator));
