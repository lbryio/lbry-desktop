import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import {
  selectIsFetchingTxos,
  selectIsFetchingTransactions,
  selectFetchingTxosError,
  selectTransactionsFile,
  selectTxoPage,
  selectTxoPageNumber,
  selectTxoItemCount,
  doFetchTxoPage,
  doFetchTransactions,
  doUpdateTxoPageParams,
} from 'lbry-redux';
import { withRouter } from 'react-router';
import TxoList from './view';

const select = (state) => ({
  txoFetchError: selectFetchingTxosError(state),
  txoPage: selectTxoPage(state),
  txoPageNumber: selectTxoPageNumber(state),
  txoItemCount: selectTxoItemCount(state),
  loading: selectIsFetchingTxos(state),
  isFetchingTransactions: selectIsFetchingTransactions(state),
  transactionsFile: selectTransactionsFile(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchTxoPage: () => dispatch(doFetchTxoPage()),
  fetchTransactions: () => dispatch(doFetchTransactions()),
  updateTxoPageParams: (params) => dispatch(doUpdateTxoPageParams(params)),
});

export default withRouter(connect(select, perform)(TxoList));
