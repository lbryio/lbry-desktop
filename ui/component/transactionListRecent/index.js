import { connect } from 'react-redux';
import {
  doFetchTransactions,
  makeSelectLatestTransactions,
  doFetchClaimListMine,
  selectMyClaimsWithoutChannels,
} from 'lbry-redux';
import TransactionListRecent from './view';

const select = state => {
  return {
    transactions: makeSelectLatestTransactions(state),
    myClaims: selectMyClaimsWithoutChannels(state),
  };
};

const perform = dispatch => ({
  fetchTransactions: (page, pageSize) => dispatch(doFetchTransactions(page, pageSize)),
  fetchClaimListMine: () => dispatch(doFetchClaimListMine()),
});

export default connect(
  select,
  perform
)(TransactionListRecent);
