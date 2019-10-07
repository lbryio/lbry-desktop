import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doToast, doUploadThumbnail } from 'lbry-redux';
import ModalAutoGenerateThumbnail from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  upload: file => dispatch(doUploadThumbnail(null, file, null, null, 'Generated')),
  showToast: options => dispatch(doToast(options)),
});

export default connect(
  null,
  perform
)(ModalAutoGenerateThumbnail);
