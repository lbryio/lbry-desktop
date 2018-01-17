import { connect } from 'react-redux';
import { doCloseModal } from 'lbry-redux';
import ModalTransactionFailed from './view';

// eslint-disable-next-line no-unused-vars
const select = state => ({});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalTransactionFailed);
