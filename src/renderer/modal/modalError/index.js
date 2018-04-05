import { connect } from 'react-redux';
import { doCloseModal } from 'lbry-redux';
import ModalError from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(null, perform)(ModalError);
