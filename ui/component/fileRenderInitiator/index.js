import { connect } from 'react-redux';
import { doUriInitiatePlay } from 'redux/actions/content';
import { selectClaimWasPurchasedForUri, selectClaimForUri } from 'redux/selectors/claims';
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
import { getThumbnailFromClaim, isStreamPlaceholderClaim } from 'util/claim';
import { doFetchChannelLiveStatus } from 'redux/actions/livestream';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const { claim_id: claimId, signing_channel: channelClaim } = claim || {};
  const { claim_id: channelClaimId } = channelClaim || {};

  return {
    claimId,
    channelClaimId,
    claimThumbnail: getThumbnailFromClaim(claim),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    obscurePreview: selectShouldObscurePreviewForUri(state, uri),
    isPlaying: makeSelectIsPlaying(uri)(state),
    insufficientCredits: selectInsufficientCreditsForUri(state, uri),
    autoplay: selectClientSetting(state, SETTINGS.AUTOPLAY_MEDIA),
    costInfo: selectCostInfoForUri(state, uri),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    claimWasPurchased: selectClaimWasPurchasedForUri(state, uri),
    authenticated: selectUserVerifiedEmail(state),
    isCurrentClaimLive: selectIsActiveLivestreamForUri(state, uri),
    isLivestreamClaim: isStreamPlaceholderClaim(claim),
  };
};

const perform = {
  doUriInitiatePlay,
  doFetchChannelLiveStatus,
};

export default withRouter(connect(select, perform)(FileRenderInitiator));
