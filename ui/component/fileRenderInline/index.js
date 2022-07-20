import { connect } from 'react-redux';
import { makeSelectFileInfoForUri, makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import { selectClaimWasPurchasedForUri } from 'redux/selectors/claims';
import { doClaimEligiblePurchaseRewards } from 'redux/actions/rewards';
import { makeSelectFileRenderModeForUri, selectFileIsPlayingOnPage } from 'redux/selectors/content';
import { withRouter } from 'react-router';
import { doAnalyticsView } from 'redux/actions/app';
import FileRenderInline from './view';
import { selectCostInfoForUri } from 'lbryinc';

const select = (state, props) => {
  const { uri } = props;

  return {
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    isPlaying: selectFileIsPlayingOnPage(state, uri),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    costInfo: selectCostInfoForUri(state, uri),
    claimWasPurchased: selectClaimWasPurchasedForUri(state, uri),
  };
};

const perform = (dispatch) => ({
  triggerAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(connect(select, perform)(FileRenderInline));
