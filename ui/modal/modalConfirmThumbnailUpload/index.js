import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doUploadThumbnail, doUpdatePublishForm } from 'lbry-redux';
import ModalConfirmThumbnailUpload from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  upload: file => dispatch(doUploadThumbnail(null, file, null, null, file.path)),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  null,
  perform
)(ModalConfirmThumbnailUpload);
