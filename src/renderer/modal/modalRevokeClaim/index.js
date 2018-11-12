import { connect } from 'react-redux';
import { doHideNotification, doAbandonClaim, selectTransactionItems } from 'lbry-redux';
import ModalRevokeClaim from './view';

const select = state => ({
  transactionItems: selectTransactionItems(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
  abandonClaim: (txid, nout) => dispatch(doAbandonClaim(txid, nout)),
});

export default connect(select, perform)(ModalRevokeClaim);
