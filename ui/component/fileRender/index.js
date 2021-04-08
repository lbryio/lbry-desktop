import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectContentTypeForUri,
  makeSelectDownloadPathForUri,
  makeSelectStreamingUrlForUri,
  SETTINGS,
} from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri, makeSelectFileExtensionForUri } from 'redux/selectors/content';
import FileRender from './view';

const select = (state, props) => {
  const autoplay = props.embedded ? false : makeSelectClientSetting(SETTINGS.AUTOPLAY)(state);
  return {
    currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    thumbnail: makeSelectThumbnailForUri(props.uri)(state),
    contentType: makeSelectContentTypeForUri(props.uri)(state),
    downloadPath: makeSelectDownloadPathForUri(props.uri)(state),
    fileExtension: makeSelectFileExtensionForUri(props.uri)(state),
    streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
    autoplay: autoplay,
  };
};

export default connect(select)(FileRender);
