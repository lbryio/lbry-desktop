import * as SETTINGS from 'constants/settings';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import {
  selectUser,
  selectAccessToken,
  doFetchAccessToken,
  selectGetSyncErrorMessage,
  selectUploadCount,
  selectUnclaimedRewards,
  doUserSetReferrer,
} from 'lbryinc';
import { doFetchTransactions, doFetchChannelListMine } from 'lbry-redux';
import { makeSelectClientSetting, selectLoadedLanguages, selectThemePath } from 'redux/selectors/settings';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doSetLanguage } from 'redux/actions/settings';
import {
  doDownloadUpgradeRequested,
  doSignIn,
  doSyncWithPreferences,
  doGetAndPopulatePreferences,
  doAnalyticsTagSync,
} from 'redux/actions/app';
import App from './view';

const select = state => ({
  user: selectUser(state),
  accessToken: selectAccessToken(state),
  theme: selectThemePath(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
  languages: selectLoadedLanguages(state),
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  syncError: selectGetSyncErrorMessage(state),
  uploadCount: selectUploadCount(state),
  rewards: selectUnclaimedRewards(state),
});

const perform = dispatch => ({
  analyticsTagSync: () => dispatch(doAnalyticsTagSync()),
  fetchTransactions: (page, pageSize) => dispatch(doFetchTransactions(page, pageSize)),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  setLanguage: language => dispatch(doSetLanguage(language)),
  signIn: () => dispatch(doSignIn()),
  requestDownloadUpgrade: () => dispatch(doDownloadUpgradeRequested()),
  checkSync: () => dispatch(doSyncWithPreferences()),
  updatePreferences: () => dispatch(doGetAndPopulatePreferences()),
  setReferrer: (referrer, doClaim) => dispatch(doUserSetReferrer(referrer, doClaim)),
});

export default hot(
  connect(
    select,
    perform
  )(App)
);
