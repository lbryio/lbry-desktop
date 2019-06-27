import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { doUpdateBlockHeight, doError, doFetchTransactions } from 'lbry-redux';
import { selectUser, doRewardList, doFetchRewardedContent } from 'lbryinc';
import { selectThemePath } from 'redux/selectors/settings';
import App from './view';

const select = state => ({
  user: selectUser(state),
  theme: selectThemePath(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doError(errorList)),
  updateBlockHeight: () => dispatch(doUpdateBlockHeight()),
  fetchRewards: () => dispatch(doRewardList()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  fetchTransactions: () => dispatch(doFetchTransactions()),
});

export default hot(
  connect(
    select,
    perform
  )(App)
);
