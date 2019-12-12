import { connect } from 'react-redux';
import { DAEMON_SETTINGS } from 'lbry-redux';
import { doSetDaemonSetting, doClearDaemonSetting, doGetDaemonStatus, doSaveCustomWalletServers, doFetchDaemonSettings } from 'redux/actions/settings';
import { selectDaemonSettings, selectSavedWalletServers, selectDaemonStatus, selectHasWalletServerPrefs } from 'redux/selectors/settings';
import SettingWalletServer from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  daemonStatus: selectDaemonStatus(state),
  customWalletServers: selectSavedWalletServers(state),
  hasWalletServerPrefs: selectHasWalletServerPrefs(state),
});

const perform = dispatch => ({
  setCustomWalletServers: (value) => dispatch(doSetDaemonSetting(DAEMON_SETTINGS.LBRYUM_SERVERS, value)),
  clearWalletServers: () => dispatch(doClearDaemonSetting(DAEMON_SETTINGS.LBRYUM_SERVERS)),
  getDaemonStatus: () => dispatch(doGetDaemonStatus()),
  saveServerConfig: (servers) => dispatch(doSaveCustomWalletServers(servers)),
  fetchDaemonSettings: () => dispatch(doFetchDaemonSettings()),
});

export default connect(
  select,
  perform
)(SettingWalletServer);
