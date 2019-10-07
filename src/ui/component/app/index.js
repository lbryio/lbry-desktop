import * as SETTINGS from 'constants/settings';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { selectUser, doRewardList, doFetchRewardedContent, doFetchAccessToken } from 'lbryinc';
import { doFetchTransactions, doFetchChannelListMine, selectBalance } from 'lbry-redux';
import { makeSelectClientSetting, selectThemePath } from 'redux/selectors/settings';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested, doSignIn } from 'redux/actions/app';
import App from './view';

const select = state => ({
  user: selectUser(state),
  theme: selectThemePath(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  balance: selectBalance(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  signIn: () => dispatch(doSignIn()),
  requestDownloadUpgrade: () => dispatch(doDownloadUpgradeRequested()),
});

export default hot(
  connect(
    select,
    perform
  )(App)
);
