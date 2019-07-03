import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doToast, doUploadThumbnail } from 'lbry-redux';
import ModalAutoGenerateThumbnail from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  upload: buffer => dispatch(doUploadThumbnail(null, buffer)),
  showToast: options => dispatch(doToast(options)),
});

export default connect(
  null,
  perform
)(ModalAutoGenerateThumbnail);
