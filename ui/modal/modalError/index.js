import { connect } from 'react-redux';
import { doDismissError } from 'lbry-redux';
import ModalError from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doDismissError()),
});

export default connect(
  null,
  perform
)(ModalError);
