import { connect } from 'react-redux';
import { makeSelectFileInfoForUri, selectStreamingUrlForUri } from 'redux/selectors/file_info';
import { selectClaimWasPurchasedForUri, selectClaimForUri, selectClaimIsMine } from 'redux/selectors/claims';
import { doClaimEligiblePurchaseRewards } from 'redux/actions/rewards';
import { makeSelectFileRenderModeForUri, selectFileIsPlayingOnPage } from 'redux/selectors/content';
import { withRouter } from 'react-router';
import { doAnalyticsView } from 'redux/actions/app';
import FileRenderInline from './view';
import { selectCostInfoForUri } from 'lbryinc';
import { selectIsProtectedContentLockedFromUserForId } from 'redux/selectors/memberships';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);

  return {
    claimIsMine: selectClaimIsMine(state, claim),
    claimWasPurchased: selectClaimWasPurchasedForUri(state, uri),
    costInfo: selectCostInfoForUri(state, uri),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    isPlaying: selectFileIsPlayingOnPage(state, uri),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    streamingUrl: selectStreamingUrlForUri(state, uri),
    contentRestrictedFromUser: claim && selectIsProtectedContentLockedFromUserForId(state, claim.claim_id),
  };
};

const perform = (dispatch) => ({
  triggerAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(connect(select, perform)(FileRenderInline));
