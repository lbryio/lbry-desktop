import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { doError, doFetchTransactions } from 'lbry-redux';
import { selectUser, doRewardList, doFetchRewardedContent, doFetchAccessToken, selectAccessToken } from 'lbryinc';
import { selectThemePath } from 'redux/selectors/settings';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested } from 'redux/actions/app';
import App from './view';

const select = state => ({
  user: selectUser(state),
  theme: selectThemePath(state),
  accessToken: selectAccessToken(state),
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doError(errorList)),
  fetchRewards: () => dispatch(doRewardList()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
  requestDownloadUpgrade: () => dispatch(doDownloadUpgradeRequested()),
});

export default hot(
  connect(
    select,
    perform
  )(App)
);
