import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doAbandonTxo, doAbandonClaim, selectTransactionItems } from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import ModalRevokeClaim from './view';

const select = state => ({
  transactionItems: selectTransactionItems(state),
});

const perform = dispatch => ({
  toast: (message, isError) => dispatch(doToast({ message, isError })),
  closeModal: () => dispatch(doHideModal()),
  abandonTxo: (txo, cb) => dispatch(doAbandonTxo(txo, cb)),
  abandonClaim: (txid, nout, cb) => dispatch(doAbandonClaim(txid, nout, cb)),
});

export default connect(select, perform)(ModalRevokeClaim);
