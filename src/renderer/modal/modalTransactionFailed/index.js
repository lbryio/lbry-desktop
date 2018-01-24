import { connect } from 'react-redux';
import { doCloseModal } from 'lbry-redux';
import ModalTransactionFailed from './view';

const select = state => ({});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalTransactionFailed);
