import { connect } from 'react-redux';
import { doToggle3PAnalytics } from 'redux/actions/app';
import { selectAllowAnalytics } from 'redux/selectors/app';
import { doSetDaemonSetting, doEnterSettingsPage, doExitSettingsPage } from 'redux/actions/settings';
import { makeSelectClientSetting, selectDaemonSettings } from 'redux/selectors/settings';
import { SETTINGS } from 'lbry-redux';
import SettingsPage from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  allowAnalytics: selectAllowAnalytics(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  autoDownload: makeSelectClientSetting(SETTINGS.AUTO_DOWNLOAD)(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
});

const perform = (dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  toggle3PAnalytics: (allow) => dispatch(doToggle3PAnalytics(allow)),
  enterSettings: () => dispatch(doEnterSettingsPage()),
  exitSettings: () => dispatch(doExitSettingsPage()),
});

export default connect(select, perform)(SettingsPage);
