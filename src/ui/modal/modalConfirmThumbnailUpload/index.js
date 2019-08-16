import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doUploadThumbnail, doUpdatePublishForm } from 'lbry-redux';
import fs from 'fs';
import path from 'path';
import ModalConfirmThumbnailUpload from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  upload: filePath => dispatch(doUploadThumbnail(filePath, null, null, fs, path)),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  null,
  perform
)(ModalConfirmThumbnailUpload);
