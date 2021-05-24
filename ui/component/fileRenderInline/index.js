import { connect } from 'react-redux';
import { makeSelectFileInfoForUri, makeSelectStreamingUrlForUri, makeSelectClaimWasPurchased } from 'lbry-redux';
import { doClaimEligiblePurchaseRewards } from 'redux/actions/rewards';
import { makeSelectFileRenderModeForUri, selectPrimaryUri } from 'redux/selectors/content';
import { withRouter } from 'react-router';
import { doAnalyticsView } from 'redux/actions/app';
import FileRenderInline from './view';
import { makeSelectCostInfoForUri } from 'lbryinc';

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  isPlaying: selectPrimaryUri(state) === props.uri,
  streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
});

const perform = (dispatch) => ({
  triggerAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(connect(select, perform)(FileRenderInline));
