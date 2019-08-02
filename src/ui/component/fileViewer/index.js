import { connect } from 'react-redux';
import { doPlayUri } from 'redux/actions/content';
import {
  makeSelectFileInfoForUri,
  makeSelectThumbnailForUri,
  makeSelectStreamingUrlForUri,
  makeSelectMediaTypeForUri,
  makeSelectUriIsStreamable,
} from 'lbry-redux';
import { makeSelectIsPlaying, makeSelectShouldObscurePreview } from 'redux/selectors/content';
import FileViewer from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  obscurePreview: makeSelectShouldObscurePreview(props.uri)(state),
  isPlaying: makeSelectIsPlaying(props.uri)(state),
  streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
  isStreamable: makeSelectUriIsStreamable(props.uri)(state),
});

const perform = dispatch => ({
  play: (uri, saveFile) => dispatch(doPlayUri(uri, saveFile)),
});

export default connect(
  select,
  perform
)(FileViewer);
