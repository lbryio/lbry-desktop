import { connect } from 'react-redux';
import { makeSelectFileInfoForUri, makeSelectMediaTypeForUri, makeSelectContentTypeForUri } from 'lbry-redux';
import { doClaimEligiblePurchaseRewards } from 'lbryinc';
import {
  makeSelectFileRenderModeForUri,
  makeSelectIsPlaying,
  makeSelectStreamingUrlForUriWebProxy,
} from 'redux/selectors/content';
import { withRouter } from 'react-router';
import { doAnalyticsView } from 'redux/actions/app';
import FileRenderInline from './view';

const select = (state, props) => ({
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  isPlaying: makeSelectIsPlaying(props.uri)(state),
  streamingUrl: makeSelectStreamingUrlForUriWebProxy(props.uri)(state),
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
});

const perform = dispatch => ({
  triggerAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(connect(select, perform)(FileRenderInline));
