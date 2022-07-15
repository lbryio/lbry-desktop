import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import {
  selectGetSyncErrorMessage,
  selectPrefsReady,
  selectSyncFatalError,
  selectSyncIsLocked,
} from 'redux/selectors/sync';
import { doUserSetReferrer } from 'redux/actions/user';
import { doSetLastViewedAnnouncement } from 'redux/actions/content';
import { selectUser, selectUserLocale, selectUserVerifiedEmail, selectHomepageFetched } from 'redux/selectors/user';
import { selectUnclaimedRewards } from 'redux/selectors/rewards';
import { doFetchChannelListMine, doFetchCollectionListMine } from 'redux/actions/claims';
import { selectMyChannelClaimIds } from 'redux/selectors/claims';
import {
  selectLanguage,
  selectLoadedLanguages,
  selectThemePath,
  selectDefaultChannelClaim,
} from 'redux/selectors/settings';
import { selectModal, selectActiveChannelClaim, selectIsReloadRequired } from 'redux/selectors/app';
import { selectUploadCount } from 'redux/selectors/publish';
import { doOpenAnnouncements, doSetLanguage, doSetDefaultChannel } from 'redux/actions/settings';
import { doSyncLoop } from 'redux/actions/sync';
import { doSignIn, doSetIncognito } from 'redux/actions/app';
import { doFetchModBlockedList, doFetchCommentModAmIList } from 'redux/actions/comments';
import App from './view';

const select = (state) => ({
  user: selectUser(state),
  locale: selectUserLocale(state),
  theme: selectThemePath(state),
  language: selectLanguage(state),
  languages: selectLoadedLanguages(state),
  isReloadRequired: selectIsReloadRequired(state),
  prefsReady: selectPrefsReady(state),
  syncError: selectGetSyncErrorMessage(state),
  syncIsLocked: selectSyncIsLocked(state),
  uploadCount: selectUploadCount(state),
  rewards: selectUnclaimedRewards(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  currentModal: selectModal(state),
  syncFatalError: selectSyncFatalError(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  myChannelClaimIds: selectMyChannelClaimIds(state),
  homepageFetched: selectHomepageFetched(state),
  defaultChannelClaim: selectDefaultChannelClaim(state),
});

const perform = {
  fetchChannelListMine: doFetchChannelListMine,
  fetchCollectionListMine: doFetchCollectionListMine,
  setLanguage: doSetLanguage,
  signIn: doSignIn,
  syncLoop: doSyncLoop,
  setReferrer: doUserSetReferrer,
  setIncognito: doSetIncognito,
  fetchModBlockedList: doFetchModBlockedList,
  fetchModAmIList: doFetchCommentModAmIList,
  doOpenAnnouncements,
  doSetLastViewedAnnouncement,
  doSetDefaultChannel,
};

export default hot(connect(select, perform)(App));
