import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectContentTypeForUri,
  makeSelectMediaTypeForUri,
  makeSelectDownloadPathForUri,
} from 'lbry-redux';
import * as SETTINGS from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import {
  makeSelectFileRenderModeForUri,
  makeSelectFileExtensionForUri,
  makeSelectStreamingUrlForUriWebProxy,
} from 'redux/selectors/content';
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
    fileExtension: makeSelectFileExtensionForUri(props.uri)(state),
    streamingUrl: makeSelectStreamingUrlForUriWebProxy(props.uri)(state),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
    autoplay: autoplay,
  };
};

const perform = dispatch => ({
  setPlayingUri: uri => dispatch(doSetPlayingUri(uri)),
});

export default connect(select, perform)(FileRender);
