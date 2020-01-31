import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectContentTypeForUri,
  makeSelectStreamingUrlForUri,
  makeSelectMediaTypeForUri,
  makeSelectDownloadPathForUri,
  makeSelectFileNameForUri,
} from 'lbry-redux';
import * as SETTINGS from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectIsText } from 'redux/selectors/content';
import { doSetPlayingUri } from 'redux/actions/content';
import FileRender from './view';

const select = (state, props) => {
  const autoplay = props.embedded ? false : makeSelectClientSetting(SETTINGS.AUTOPLAY)(state);
  return {
    currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    mediaType: makeSelectMediaTypeForUri(props.uri)(state),
    thumbnail: makeSelectThumbnailForUri(props.uri)(state),
    contentType: makeSelectContentTypeForUri(props.uri)(state),
    downloadPath: makeSelectDownloadPathForUri(props.uri)(state),
    fileName: makeSelectFileNameForUri(props.uri)(state),
    streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
    autoplay: autoplay,
    isText: makeSelectIsText(props.uri)(state),
  };
};

const perform = dispatch => ({
  setPlayingUri: uri => dispatch(doSetPlayingUri(uri)),
});

export default connect(
  select,
  perform
)(FileRender);
