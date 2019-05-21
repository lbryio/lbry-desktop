import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doUploadThumbnail } from 'redux/actions/publish';
import { doToast } from 'lbry-redux';
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
