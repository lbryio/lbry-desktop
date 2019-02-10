import { connect } from 'react-redux';
import {
  doFetchTransactions,
  selectRecentTransactions,
  selectHasTransactions,
  selectIsFetchingTransactions,
  doFetchClaimListMine,
} from 'lbry-redux';
import TransactionListRecent from './view';

const select = state => ({
  fetchingTransactions: selectIsFetchingTransactions(state),
  transactions: selectRecentTransactions(state),
  hasTransactions: selectHasTransactions(state),
});

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchMyClaims: () => dispatch(doFetchClaimListMine()),
});

export default connect(
  select,
  perform
)(TransactionListRecent);
