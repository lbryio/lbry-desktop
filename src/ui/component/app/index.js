import * as SETTINGS from 'constants/settings';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { selectUser, doRewardList, doFetchRewardedContent, doFetchAccessToken, selectAccessToken } from 'lbryinc';
import { doFetchTransactions, doFetchChannelListMine, selectBalance } from 'lbry-redux';
import { makeSelectClientSetting, selectThemePath } from 'redux/selectors/settings';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested, doSignIn, doSyncWithPreferences } from 'redux/actions/app';
import { doSetClientSetting } from 'redux/actions/settings';
import App from './view';

const select = state => ({
  user: selectUser(state),
  theme: selectThemePath(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  balance: selectBalance(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  accessToken: selectAccessToken(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  fetchTransactions: () => dispatch(doFetchTransactions()),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  signIn: () => dispatch(doSignIn()),
  requestDownloadUpgrade: () => dispatch(doDownloadUpgradeRequested()),
  checkSync: () => dispatch(doSyncWithPreferences()),
  setSyncEnabled: value => dispatch(doSetClientSetting(SETTINGS.ENABLE_SYNC, value)),
});

export default hot(
  connect(
    select,
    perform
  )(App)
);
