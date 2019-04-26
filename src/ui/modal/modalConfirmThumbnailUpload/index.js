import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doUploadThumbnail, doUpdatePublishForm } from 'redux/actions/publish';
import ModalConfirmThumbnailUpload from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  upload: path => dispatch(doUploadThumbnail(path)),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  null,
  perform
)(ModalConfirmThumbnailUpload);
