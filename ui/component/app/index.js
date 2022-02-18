import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { selectGetSyncErrorMessage, selectSyncFatalError } from 'redux/selectors/sync';
import { doFetchAccessToken, doUserSetReferrer } from 'redux/actions/user';
import { selectUser, selectAccessToken, selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectUnclaimedRewards } from 'redux/selectors/rewards';
import { doFetchChannelListMine, doFetchCollectionListMine, doResolveUris } from 'redux/actions/claims';
import { selectMyChannelUrls, selectMyChannelClaimIds } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import {
  makeSelectClientSetting,
  selectLanguage,
  selectLoadedLanguages,
  selectThemePath,
} from 'redux/selectors/settings';
import {
  selectIsUpgradeAvailable,
  selectAutoUpdateDownloaded,
  selectModal,
  selectActiveChannelClaim,
  selectIsUpdateModelDisplayed,
} from 'redux/selectors/app';
import { doGetWalletSyncPreference, doSetLanguage } from 'redux/actions/settings';
import { doSyncLoop } from 'redux/actions/sync';
import {
  doDownloadUpgradeRequested,
  doSignIn,
  doGetAndPopulatePreferences,
  doSetActiveChannel,
  doSetIncognito,
} from 'redux/actions/app';
import { doFetchModBlockedList, doFetchCommentModAmIList } from 'redux/actions/comments';
import App from './view';

const select = (state) => ({
  user: selectUser(state),
  accessToken: selectAccessToken(state),
  theme: selectThemePath(state),
  language: selectLanguage(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  languages: selectLoadedLanguages(state),
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  syncError: selectGetSyncErrorMessage(state),
  rewards: selectUnclaimedRewards(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  currentModal: selectModal(state),
  syncFatalError: selectSyncFatalError(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  myChannelUrls: selectMyChannelUrls(state),
  myChannelClaimIds: selectMyChannelClaimIds(state),
  subscriptions: selectSubscriptions(state),
  isUpdateModalDisplayed: selectIsUpdateModelDisplayed(state),
});

const perform = (dispatch) => ({
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  fetchCollectionListMine: () => dispatch(doFetchCollectionListMine()),
  setLanguage: (language) => dispatch(doSetLanguage(language)),
  signIn: () => dispatch(doSignIn()),
  requestDownloadUpgrade: () => dispatch(doDownloadUpgradeRequested()),
  updatePreferences: () => dispatch(doGetAndPopulatePreferences()),
  getWalletSyncPref: () => dispatch(doGetWalletSyncPreference()),
  syncLoop: (noInterval) => dispatch(doSyncLoop(noInterval)),
  setReferrer: (referrer, doClaim) => dispatch(doUserSetReferrer(referrer, doClaim)),
  setActiveChannelIfNotSet: () => dispatch(doSetActiveChannel()),
  setIncognito: () => dispatch(doSetIncognito()),
  fetchModBlockedList: () => dispatch(doFetchModBlockedList()),
  resolveUris: (uris) => dispatch(doResolveUris(uris)),
  fetchModAmIList: () => dispatch(doFetchCommentModAmIList()),
});

export default hot(connect(select, perform)(App));
