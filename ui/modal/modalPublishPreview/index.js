import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalPublishPreview from './view';
import { makeSelectPublishFormValue, selectPublishFormValues } from 'lbry-redux';
import { selectFfmpegStatus } from 'redux/selectors/settings';
import { doPublishDesktop } from 'redux/actions/publish';

const select = state => ({
  ...selectPublishFormValues(state),
  isVid: makeSelectPublishFormValue('fileVid')(state),
  ffmpegStatus: selectFfmpegStatus(state),
});

const perform = dispatch => ({
  publish: (filePath, preview) => dispatch(doPublishDesktop(filePath, preview)),
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalPublishPreview);
