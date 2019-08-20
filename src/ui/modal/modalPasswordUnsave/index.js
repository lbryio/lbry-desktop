import { connect } from 'react-redux';
import ModalPasswordUnsave from './view';
import { doHideModal, doPasswordSaved } from 'redux/actions/app';

// const select = () => ({});
//
const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  setPasswordSaved: saved => dispatch(doPasswordSaved(saved)),
});

export default connect(
  null,
  perform
)(ModalPasswordUnsave);
