import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { doError, doFetchTransactions, doFetchChannelListMine } from 'lbry-redux';
import { selectUser, doRewardList, doFetchRewardedContent, doFetchAccessToken } from 'lbryinc';
import { selectThemePath } from 'redux/selectors/settings';
import { doSignIn } from 'redux/actions/app';
import App from './view';

const select = state => ({
  user: selectUser(state),
  theme: selectThemePath(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doError(errorList)),
  fetchRewards: () => dispatch(doRewardList()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  onSignedIn: () => dispatch(doSignIn()),
});

export default hot(
  connect(
    select,
    perform
  )(App)
);
