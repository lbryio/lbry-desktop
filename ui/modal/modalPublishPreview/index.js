import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalPublishPreview from './view';
import { makeSelectPublishFormValue, selectPublishFormValues, selectIsStillEditing } from 'redux/selectors/publish';
import { selectMyChannelClaims } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { selectFfmpegStatus, makeSelectClientSetting } from 'redux/selectors/settings';
import { doPublishDesktop } from 'redux/actions/publish';
import { doSetClientSetting } from 'redux/actions/settings';

const select = (state) => {
  return {
    ...selectPublishFormValues(state),
    myChannels: selectMyChannelClaims(state),
    isVid: makeSelectPublishFormValue('fileVid')(state),
    publishing: makeSelectPublishFormValue('publishing')(state),
    isStillEditing: selectIsStillEditing(state),
    ffmpegStatus: selectFfmpegStatus(state),
    enablePublishPreview: makeSelectClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW)(state),
  };
};

const perform = (dispatch) => ({
  publish: (filePath, preview) => dispatch(doPublishDesktop(filePath, preview)),
  closeModal: () => dispatch(doHideModal()),
  setEnablePublishPreview: (value) => dispatch(doSetClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW, value)),
});

export default connect(select, perform)(ModalPublishPreview);
