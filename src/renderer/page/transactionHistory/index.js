import { connect } from 'react-redux';
import {
  doFetchTransactions,
  selectTransactionItems,
  selectIsFetchingTransactions,
  doFetchClaimListMine,
} from 'lbry-redux';
import TransactionHistoryPage from './view';

const select = state => ({
  fetchingTransactions: selectIsFetchingTransactions(state),
  transactions: selectTransactionItems(state),
});

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchMyClaims: () => dispatch(doFetchClaimListMine()),
});

export default connect(
  select,
  perform
)(TransactionHistoryPage);
