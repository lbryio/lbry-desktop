import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalPublishPreview from './view';
import { makeSelectPublishFormValue, selectPublishFormValues, selectIsStillEditing } from 'redux/selectors/publish';
import { selectMyChannelClaims, selectIsStreamPlaceholderForUri } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { selectFfmpegStatus, selectClientSetting, selectLanguage } from 'redux/selectors/settings';
import { doPublishDesktop } from 'redux/actions/publish';
import { doSetClientSetting } from 'redux/actions/settings';

const select = (state, props) => {
  const editingUri = makeSelectPublishFormValue('editingURI')(state);

  return {
    ...selectPublishFormValues(state),
    myChannels: selectMyChannelClaims(state),
    isVid: makeSelectPublishFormValue('fileVid')(state),
    publishSuccess: makeSelectPublishFormValue('publishSuccess')(state),
    publishing: makeSelectPublishFormValue('publishing')(state),
    remoteFile: makeSelectPublishFormValue('remoteFileUrl')(state),
    isStillEditing: selectIsStillEditing(state),
    ffmpegStatus: selectFfmpegStatus(state),
    enablePublishPreview: selectClientSetting(state, SETTINGS.ENABLE_PUBLISH_PREVIEW),
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, editingUri),
    appLanguage: selectLanguage(state), // note: publishForm above has 'language'
  };
};

const perform = (dispatch) => ({
  publish: (filePath, preview) => dispatch(doPublishDesktop(filePath, preview)),
  closeModal: () => dispatch(doHideModal()),
  setEnablePublishPreview: (value) => dispatch(doSetClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW, value)),
});

export default connect(select, perform)(ModalPublishPreview);
