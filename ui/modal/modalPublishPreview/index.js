import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalPublishPreview from './view';
import {
  makeSelectPublishFormValue,
  selectPublishFormValues,
  selectIsStillEditing,
  SETTINGS,
} from 'lbry-redux';
import { selectFfmpegStatus, makeSelectClientSetting } from 'redux/selectors/settings';
import { doPublishDesktop } from 'redux/actions/publish';
import { doSetClientSetting } from 'redux/actions/settings';

const select = state => ({
  ...selectPublishFormValues(state),
  isVid: makeSelectPublishFormValue('fileVid')(state),
  isStillEditing: selectIsStillEditing(state),
  ffmpegStatus: selectFfmpegStatus(state),
  enablePublishPreview: makeSelectClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW)(state),
});

const perform = dispatch => ({
  publish: (filePath, preview) => dispatch(doPublishDesktop(filePath, preview)),
  closeModal: () => dispatch(doHideModal()),
  setEnablePublishPreview: value => dispatch(doSetClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW, value)),
});

export default connect(select, perform)(ModalPublishPreview);
