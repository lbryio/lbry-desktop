import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doAbandonTxo, doResolveUri } from 'redux/actions/claims';
import { selectTransactionItems } from 'redux/selectors/wallet';
import { doToast } from 'redux/actions/notifications';
import ModalRevokeClaim from './view';

const select = (state) => ({
  transactionItems: selectTransactionItems(state),
});

const perform = (dispatch) => ({
  toast: (message, isError) => dispatch(doToast({ message, isError })),
  closeModal: () => dispatch(doHideModal()),
  abandonTxo: (txo, cb) => dispatch(doAbandonTxo(txo, cb)),
  doResolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(ModalRevokeClaim);
