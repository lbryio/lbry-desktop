import { connect } from 'react-redux';
import {
  doFetchTransactions,
  selectRecentTransactions,
  selectHasTransactions,
  selectIsFetchingTransactions,
} from 'lbry-redux';
import TransactionListRecent from './view';

const select = state => ({
  fetchingTransactions: selectIsFetchingTransactions(state),
  transactions: selectRecentTransactions(state),
  hasTransactions: selectHasTransactions(state),
});

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
});

export default connect(select, perform)(TransactionListRecent);
