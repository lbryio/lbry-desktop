import { connect } from 'react-redux';
import { doEnterSettingsPage, doExitSettingsPage } from 'redux/actions/settings';
import { selectDaemonSettings } from 'redux/selectors/settings';
import SettingsPage from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  isAuthenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch) => ({
  enterSettings: () => dispatch(doEnterSettingsPage()),
  exitSettings: () => dispatch(doExitSettingsPage()),
});

export default connect(select, perform)(SettingsPage);
