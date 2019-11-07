import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import {
  makeSelectFileInfoForUri,
  makeSelectThumbnailForUri,
  makeSelectStreamingUrlForUri,
  makeSelectMediaTypeForUri,
  makeSelectUriIsStreamable,
  makeSelectTitleForUri,
} from 'lbry-redux';
import { doClaimEligiblePurchaseRewards } from 'lbryinc';
import { makeSelectIsPlaying, makeSelectShouldObscurePreview, selectPlayingUri } from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import { withRouter } from 'react-router';
import { doAnalyticsView } from 'redux/actions/app';
import FileViewer from './view';

const select = (state, props) => {
  const uri = selectPlayingUri(state);
  return {
    uri,
    title: makeSelectTitleForUri(uri)(state),
    thumbnail: makeSelectThumbnailForUri(uri)(state),
    mediaType: makeSelectMediaTypeForUri(uri)(state),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    obscurePreview: makeSelectShouldObscurePreview(uri)(state),
    isPlaying: makeSelectIsPlaying(uri)(state),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    isStreamable: makeSelectUriIsStreamable(uri)(state),
    floatingPlayerEnabled: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  };
};

const perform = dispatch => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri(null)),
  triggerAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(
  connect(
    select,
    perform
  )(FileViewer)
);
