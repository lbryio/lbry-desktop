import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectFileInfoForUri,
  makeSelectThumbnailForUri,
  makeSelectContentTypeForUri,
  makeSelectDownloadPathForUri,
  makeSelectStreamingUrlForUri,
  makeSelectClaimIsMine,
  SETTINGS,
} from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri, makeSelectFileExtensionForUri } from 'redux/selectors/content';
import { doOpenModal } from 'redux/actions/app';
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
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(FileRender);
