import { connect } from 'react-redux';
import { doUriInitiatePlay, doSetPlayingUri, doSetPrimaryUri } from 'redux/actions/content';
import { selectThumbnailForUri, makeSelectClaimWasPurchased } from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import * as SETTINGS from 'constants/settings';
import { selectCostInfoForUri } from 'lbryinc';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectClientSetting } from 'redux/selectors/settings';
import { withRouter } from 'react-router';
import {
  makeSelectIsPlaying,
  selectShouldObscurePreviewForUri,
  selectInsufficientCreditsForUri,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import FileRenderInitiator from './view';
import { selectIsActiveLivestreamForUri } from 'redux/selectors/livestream';

const select = (state, props) => {
  const { uri } = props;

  return {
    claimThumbnail: selectThumbnailForUri(state, uri),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    obscurePreview: selectShouldObscurePreviewForUri(state, uri),
    isPlaying: makeSelectIsPlaying(uri)(state),
    insufficientCredits: selectInsufficientCreditsForUri(state, uri),
    autoplay: selectClientSetting(state, SETTINGS.AUTOPLAY_MEDIA),
    costInfo: selectCostInfoForUri(state, uri),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    claimWasPurchased: makeSelectClaimWasPurchased(uri)(state),
    authenticated: selectUserVerifiedEmail(state),
    isCurrentClaimLive: selectIsActiveLivestreamForUri(state, uri),
  };
};

const perform = {
  doUriInitiatePlay,
  doSetPlayingUri,
  doSetPrimaryUri,
};

export default withRouter(connect(select, perform)(FileRenderInitiator));
