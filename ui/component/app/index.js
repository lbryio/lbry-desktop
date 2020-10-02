import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { selectUploadCount } from 'lbryinc';
import { selectGetSyncErrorMessage } from 'redux/selectors/sync';
import { doFetchAccessToken, doUserSetReferrer } from 'redux/actions/user';
import { selectUser, selectAccessToken, selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectUnclaimedRewards } from 'redux/selectors/rewards';
import { doFetchChannelListMine, SETTINGS } from 'lbry-redux';
import { makeSelectClientSetting, selectLoadedLanguages, selectThemePath } from 'redux/selectors/settings';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded, selectModal } from 'redux/selectors/app';
import { doGetWalletSyncPreference, doSetLanguage } from 'redux/actions/settings';
import { doSyncSubscribe } from 'redux/actions/syncwrapper';
import {
  doDownloadUpgradeRequested,
  doSignIn,
  doGetAndPopulatePreferences,
  doAnalyticsTagSync,
} from 'redux/actions/app';
import App from './view';

const select = state => ({
  user: selectUser(state),
  accessToken: selectAccessToken(state),
  theme: selectThemePath(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  languages: selectLoadedLanguages(state),
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  syncError: selectGetSyncErrorMessage(state),
  uploadCount: selectUploadCount(state),
  rewards: selectUnclaimedRewards(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  currentModal: selectModal(state),
});

const perform = dispatch => ({
  analyticsTagSync: () => dispatch(doAnalyticsTagSync()),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  setLanguage: language => dispatch(doSetLanguage(language)),
  signIn: () => dispatch(doSignIn()),
  requestDownloadUpgrade: () => dispatch(doDownloadUpgradeRequested()),
  updatePreferences: () => dispatch(doGetAndPopulatePreferences()),
  getWalletSyncPref: () => dispatch(doGetWalletSyncPreference()),
  syncSubscribe: () => dispatch(doSyncSubscribe()),
  setReferrer: (referrer, doClaim) => dispatch(doUserSetReferrer(referrer, doClaim)),
});

export default hot(connect(select, perform)(App));
