import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { selectBalance, formatCredits, selectMyChannelClaims, SETTINGS } from 'lbry-redux';
import { selectGetSyncErrorMessage } from 'redux/selectors/sync';
import { selectUserVerifiedEmail, selectUserEmail, selectEmailToVerify, selectUser } from 'redux/selectors/user';
import { doClearEmailEntry, doClearPasswordEntry } from 'redux/actions/user';
import { doSetClientSetting } from 'redux/actions/settings';
import { doSignOut, doOpenModal } from 'redux/actions/app';
import { makeSelectClientSetting, selectLanguage } from 'redux/selectors/settings';
import { selectCommentChannel } from 'redux/selectors/comments';
import Header from './view';
import { selectHasNavigated } from 'redux/selectors/app';

const select = state => ({
  balance: selectBalance(state),
  language: selectLanguage(state),
  roundedBalance: formatCredits(selectBalance(state), 2, true),
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED)(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
  authenticated: selectUserVerifiedEmail(state),
  email: selectUserEmail(state),
  syncError: selectGetSyncErrorMessage(state),
  emailToVerify: selectEmailToVerify(state),
  hasNavigated: selectHasNavigated(state),
  user: selectUser(state),
  myChannels: selectMyChannelClaims(state),
  commentChannel: selectCommentChannel(state),
});

const perform = dispatch => ({
  setClientSetting: (key, value, push) => dispatch(doSetClientSetting(key, value, push)),
  signOut: () => dispatch(doSignOut()),
  openChannelCreate: () => dispatch(doOpenModal(MODALS.CREATE_CHANNEL)),
  openSignOutModal: () => dispatch(doOpenModal(MODALS.SIGN_OUT)),
  clearEmailEntry: () => dispatch(doClearEmailEntry()),
  clearPasswordEntry: () => dispatch(doClearPasswordEntry()),
});

export default connect(select, perform)(Header);
