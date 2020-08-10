import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { selectBalance, formatCredits, SETTINGS } from 'lbry-redux';
import { selectGetSyncErrorMessage } from 'lbryinc';
import { selectUserVerifiedEmail, selectUserEmail, selectEmailToVerify } from 'redux/selectors/user';
import { doClearEmailEntry, doClearPasswordEntry } from 'redux/actions/user';
import { doSetClientSetting, doSyncClientSettings } from 'redux/actions/settings';
import { doSignOut, doOpenModal } from 'redux/actions/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import Header from './view';
import { selectHasNavigated } from 'redux/selectors/app';

const select = state => ({
  balance: selectBalance(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  roundedBalance: formatCredits(selectBalance(state), 2, true),
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED)(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
  authenticated: selectUserVerifiedEmail(state),
  email: selectUserEmail(state),
  syncError: selectGetSyncErrorMessage(state),
  emailToVerify: selectEmailToVerify(state),
  hasNavigated: selectHasNavigated(state),
});

const perform = dispatch => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  syncSettings: () => dispatch(doSyncClientSettings()),
  signOut: () => dispatch(doSignOut()),
  openChannelCreate: () => dispatch(doOpenModal(MODALS.CREATE_CHANNEL)),
  openSignOutModal: () => dispatch(doOpenModal(MODALS.SIGN_OUT)),
  clearEmailEntry: () => dispatch(doClearEmailEntry()),
  clearPasswordEntry: () => dispatch(doClearPasswordEntry()),
});

export default connect(select, perform)(Header);
