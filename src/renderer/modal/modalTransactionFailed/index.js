import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import ModalTransactionFailed from './view';

const select = () => ({});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
});

export default connect(
  select,
  perform
)(ModalTransactionFailed);
