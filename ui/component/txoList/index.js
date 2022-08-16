import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doFetchTxoPage, doFetchTransactions, doUpdateTxoPageParams } from 'redux/actions/wallet';
import { doCustomerListPaymentHistory, doListAccountTransactions } from 'redux/actions/stripe';
import { selectPaymentHistory, selectAccountTransactions } from 'redux/selectors/stripe';
import {
  selectIsFetchingTxos,
  selectIsFetchingTransactions,
  selectFetchingTxosError,
  selectTransactionsFile,
  selectTxoPage,
  selectTxoPageNumber,
  selectTxoItemCount,
} from 'redux/selectors/wallet';
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
  accountPaymentHistory: selectPaymentHistory(state),
  accountTransactions: selectAccountTransactions(state),
});

const perform = {
  openModal: doOpenModal,
  fetchTxoPage: doFetchTxoPage,
  fetchTransactions: doFetchTransactions,
  updateTxoPageParams: doUpdateTxoPageParams,
  doCustomerListPaymentHistory,
  doListAccountTransactions,
};

export default withRouter(connect(select, perform)(TxoList));
