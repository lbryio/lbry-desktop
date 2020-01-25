import * as SETTINGS from 'constants/settings';
import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { selectBalance, formatCredits } from 'lbry-redux';
import { selectUserVerifiedEmail, selectGetSyncErrorMessage, selectUserEmail } from 'lbryinc';
import { doSetClientSetting } from 'redux/actions/settings';
import { doSignOut, doOpenModal } from 'redux/actions/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import Header from './view';

const select = state => ({
  balance: selectBalance(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  roundedBalance: formatCredits(selectBalance(state) || 0, 2, true),
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED)(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
  authenticated: selectUserVerifiedEmail(state),
  email: selectUserEmail(state),
  syncError: selectGetSyncErrorMessage(state),
});

const perform = dispatch => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  signOut: () => dispatch(doSignOut()),
  openMobileNavigation: () => dispatch(doOpenModal(MODALS.MOBILE_NAVIGATION)),
  openChannelCreate: () => dispatch(doOpenModal(MODALS.CREATE_CHANNEL)),
});

export default connect(
  select,
  perform
)(Header);
