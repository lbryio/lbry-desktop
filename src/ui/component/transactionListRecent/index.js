import { connect } from 'react-redux';
import { doFetchTransactions, selectRecentTransactions, doFetchClaimListMine } from 'lbry-redux';
import TransactionListRecent from './view';

const select = state => ({
  transactions: selectRecentTransactions(state),
});

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchMyClaims: () => dispatch(doFetchClaimListMine()),
});

export default connect(
  select,
  perform
)(TransactionListRecent);
