import { connect } from 'react-redux';
import { doCloseModal, doAbandonClaim, selectTransactionItems } from 'lbry-redux';
import ModalRevokeClaim from './view';

const select = state => ({
  transactionItems: selectTransactionItems(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  abandonClaim: (txid, nout) => dispatch(doAbandonClaim(txid, nout)),
});

export default connect(select, perform)(ModalRevokeClaim);
