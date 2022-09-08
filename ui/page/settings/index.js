import { connect } from 'react-redux';
import { doEnterSettingsPage, doExitSettingsPage } from 'redux/actions/settings';
import { selectDaemonSettings, selectLanguage } from 'redux/selectors/settings';
import { selectPrefsReady } from 'redux/selectors/sync';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

import SettingsPage from './view';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  prefsReady: selectPrefsReady(state),
  language: selectLanguage(state),
});

const perform = (dispatch) => ({
  enterSettings: () => dispatch(doEnterSettingsPage()),
  exitSettings: () => dispatch(doExitSettingsPage()),
});

export default connect(select, perform)(SettingsPage);
