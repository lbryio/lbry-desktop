import { connect } from 'react-redux';
import { doFetchTransactions, makeSelectLatestTransactions } from 'lbry-redux';
import TransactionListRecent from './view';

const select = state => {
  return {
    transactions: makeSelectLatestTransactions(state),
  };
};

const perform = dispatch => ({
  fetchTransactions: (page, pageSize) => dispatch(doFetchTransactions(page, pageSize)),
});

export default connect(
  select,
  perform
)(TransactionListRecent);
