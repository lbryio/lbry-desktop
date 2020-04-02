import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { doPlayUri, doSetPlayingUri } from 'redux/actions/content';
import { makeSelectFileInfoForUri, makeSelectThumbnailForUri, makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { withRouter } from 'react-router';
import {
  makeSelectIsPlaying,
  makeSelectShouldObscurePreview,
  selectPlayingUri,
  makeSelectInsufficientCreditsForUri,
  makeSelectStreamingUrlForUriWebProxy,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import FileRenderInitiator from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  obscurePreview: makeSelectShouldObscurePreview(props.uri)(state),
  isPlaying: makeSelectIsPlaying(props.uri)(state),
  playingUri: selectPlayingUri(state),
  insufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
  streamingUrl: makeSelectStreamingUrlForUriWebProxy(props.uri)(state),
  autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
  hasCostInfo: Boolean(makeSelectCostInfoForUri(props.uri)(state)),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  play: uri => {
    dispatch(doSetPlayingUri(uri));
    // @if TARGET='app'
    dispatch(doPlayUri(uri));
    // @endif
  },
});

export default withRouter(connect(select, perform)(FileRenderInitiator));
