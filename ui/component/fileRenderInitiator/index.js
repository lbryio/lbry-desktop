import { connect } from 'react-redux';
import { doUriInitiatePlay } from 'redux/actions/content';
import {
  selectClaimWasPurchasedForUri,
  selectClaimForUri,
  selectClaimIsMine,
  selectIsFiatPaidForUri,
  selectIsFiatRequiredForUri,
  selectIsFetchingPurchases,
} from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import * as SETTINGS from 'constants/settings';
import { selectCostInfoForUri } from 'lbryinc';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectClientSetting } from 'redux/selectors/settings';
import { withRouter } from 'react-router';
import {
  selectFileIsPlayingOnPage,
  selectShouldObscurePreviewForUri,
  selectInsufficientCreditsForUri,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import FileRenderInitiator from './view';
import { selectIsActiveLivestreamForUri } from 'redux/selectors/livestream';
import { getThumbnailFromClaim, isStreamPlaceholderClaim } from 'util/claim';
import { doFetchChannelLiveStatus } from 'redux/actions/livestream';
import {
  selectIsProtectedContentLockedFromUserForId,
  selectNoRestrictionOrUserIsMemberForContentClaimId,
} from 'redux/selectors/memberships';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const { claim_id: claimId, signing_channel: channelClaim } = claim || {};
  const { claim_id: channelClaimId } = channelClaim || {};

  return {
    authenticated: selectUserVerifiedEmail(state),
    autoplay: selectClientSetting(state, SETTINGS.AUTOPLAY_MEDIA),
    channelClaimId,
    claimId,
    claimIsMine: selectClaimIsMine(state, claim),
    claimThumbnail: getThumbnailFromClaim(claim),
    sdkPaid: selectClaimWasPurchasedForUri(state, uri),
    fiatPaid: selectIsFiatPaidForUri(state, uri),
    fiatRequired: selectIsFiatRequiredForUri(state, uri),
    isFetchingPurchases: selectIsFetchingPurchases(state),
    costInfo: selectCostInfoForUri(state, uri),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    insufficientCredits: selectInsufficientCreditsForUri(state, uri),
    isCurrentClaimLive: selectIsActiveLivestreamForUri(state, uri),
    isLivestreamClaim: isStreamPlaceholderClaim(claim),
    isPlaying: selectFileIsPlayingOnPage(state, uri),
    obscurePreview: selectShouldObscurePreviewForUri(state, uri),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    contentRestrictedFromUser: claimId && selectIsProtectedContentLockedFromUserForId(state, claimId),
    contentUnlocked: claimId && selectNoRestrictionOrUserIsMemberForContentClaimId(state, claimId),
  };
};

const perform = {
  doUriInitiatePlay,
  doFetchChannelLiveStatus,
};

export default withRouter(connect(select, perform)(FileRenderInitiator));
