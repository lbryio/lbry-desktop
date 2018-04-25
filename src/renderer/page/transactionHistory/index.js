import { connect } from 'react-redux';
import {
  doFetchTransactions,
  selectTransactionItems,
  selectIsFetchingTransactions,
} from 'lbry-redux';
import TransactionHistoryPage from './view';

const select = state => ({
  fetchingTransactions: selectIsFetchingTransactions(state),
  transactions: selectTransactionItems(state),
});

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
});

export default connect(select, perform)(TransactionHistoryPage);
