import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doUploadThumbnail, doUpdatePublishForm } from 'lbry-redux';
import fs from 'fs';
import ModalConfirmThumbnailUpload from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  upload: path => dispatch(doUploadThumbnail(path, null, null, fs)),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  null,
  perform
)(ModalConfirmThumbnailUpload);
