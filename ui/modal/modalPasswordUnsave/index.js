import { connect } from 'react-redux';
import ModalPasswordUnsave from './view';
import { doHideModal } from 'redux/actions/app';

// const select = () => ({});
//
const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(
  null,
  perform
)(ModalPasswordUnsave);
