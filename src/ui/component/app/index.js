import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { doError, doFetchTransactions } from 'lbry-redux';
import { selectUser, doRewardList, doFetchRewardedContent, doFetchAccessToken, selectAccessToken } from 'lbryinc';
import { selectThemePath } from 'redux/selectors/settings';
import App from './view';

const select = state => ({
  user: selectUser(state),
  theme: selectThemePath(state),
  accessToken: selectAccessToken(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doError(errorList)),
  fetchRewards: () => dispatch(doRewardList()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
});

export default hot(
  connect(
    select,
    perform
  )(App)
);
