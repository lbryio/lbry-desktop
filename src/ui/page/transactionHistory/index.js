import { connect } from 'react-redux';
import {
  doFetchTransactions,
  doFetchClaimListMine,
  makeSelectFilteredTransactionsForPage,
  selectFilteredTransactionCount,
} from 'lbry-redux';
import { withRouter } from 'react-router';

import TransactionHistoryPage from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get('page')) || 1;
  return {
    page,
    filteredTransactionPage: makeSelectFilteredTransactionsForPage(page)(state),
    filteredTransactionsCount: selectFilteredTransactionCount(state),
  };
};

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchMyClaims: () => dispatch(doFetchClaimListMine()),
});

export default withRouter(
  connect(
    select,
    perform
  )(TransactionHistoryPage)
);
