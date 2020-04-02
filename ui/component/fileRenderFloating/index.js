import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectFileInfoForUri, makeSelectTitleForUri } from 'lbry-redux';
import { doClaimEligiblePurchaseRewards } from 'lbryinc';
import {
  makeSelectIsPlaying,
  selectPlayingUri,
  makeSelectFileRenderModeForUri,
  makeSelectStreamingUrlForUriWebProxy,
} from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import { withRouter } from 'react-router';
import { doAnalyticsView } from 'redux/actions/app';
import FileRenderFloating from './view';

const select = (state, props) => {
  const uri = selectPlayingUri(state);
  return {
    uri,
    title: makeSelectTitleForUri(uri)(state),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    isPlaying: makeSelectIsPlaying(uri)(state),
    streamingUrl: makeSelectStreamingUrlForUriWebProxy(uri)(state),
    floatingPlayerEnabled: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
  };
};

const perform = dispatch => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri(null)),
  triggerAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(connect(select, perform)(FileRenderFloating));
