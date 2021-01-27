import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalViewImage from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(null, perform)(ModalViewImage);
