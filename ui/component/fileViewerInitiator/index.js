import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { doPlayUri, doSetPlayingUri } from 'redux/actions/content';
import {
  makeSelectFileInfoForUri,
  makeSelectThumbnailForUri,
  makeSelectStreamingUrlForUri,
  makeSelectMediaTypeForUri,
  makeSelectContentTypeForUri,
  makeSelectUriIsStreamable,
  makeSelectClaimForUri,
} from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import {
  makeSelectIsPlaying,
  makeSelectShouldObscurePreview,
  selectPlayingUri,
  makeSelectCanAutoplay,
  makeSelectIsText,
} from 'redux/selectors/content';
import FileViewer from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  obscurePreview: makeSelectShouldObscurePreview(props.uri)(state),
  isPlaying: makeSelectIsPlaying(props.uri)(state),
  playingUri: selectPlayingUri(state),
  streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
  isStreamable: makeSelectUriIsStreamable(props.uri)(state),
  autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
  hasCostInfo: Boolean(makeSelectCostInfoForUri(props.uri)(state)),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  isAutoPlayable: makeSelectCanAutoplay(props.uri)(state),
  isText: makeSelectIsText(props.uri)(state),
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

export default connect(
  select,
  perform
)(FileViewer);
