import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doAbandonClaim, selectTransactionItems } from 'lbry-redux';
import ModalRevokeClaim from './view';

const select = state => ({
  transactionItems: selectTransactionItems(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  abandonClaim: (txid, nout) => dispatch(doAbandonClaim(txid, nout)),
});

export default connect(
  select,
  perform
)(ModalRevokeClaim);
