import { connect } from 'react-redux';
import { doFetchTransactions, selectIsFetchingTransactions } from 'lbry-redux';
import RefreshTransactionButton from './view';

const select = state => ({
  fetchingTransactions: selectIsFetchingTransactions(state),
});

const perform = dispatch => ({
  fetchTransactions: (page, pageSize) => dispatch(doFetchTransactions(page, pageSize)),
});

export default connect(
  select,
  perform
)(RefreshTransactionButton);
