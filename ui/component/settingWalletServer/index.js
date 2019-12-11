import { connect } from 'react-redux';
import { DAEMON_SETTINGS } from 'lbry-redux';
import { doSetDaemonSetting, doClearDaemonSetting, doGetDaemonStatus, doCacheCustomWalletServers, doFetchDaemonSettings } from 'redux/actions/settings';
import { selectDaemonSettings, selectCachedWalletServers, makeSelectSharedPrefsForKey } from 'redux/selectors/settings';
import SettingWalletServer from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  customServers: selectCachedWalletServers(state),
  serverPrefs: makeSelectSharedPrefsForKey(DAEMON_SETTINGS.LBRYUM_SERVERS)(state),
});

const perform = dispatch => ({
  setWalletServers: (value) => dispatch(doSetDaemonSetting(DAEMON_SETTINGS.LBRYUM_SERVERS, value)),
  clearWalletServers: () => dispatch(doClearDaemonSetting(DAEMON_SETTINGS.LBRYUM_SERVERS)),
  getDaemonStatus: () => dispatch(doGetDaemonStatus()),
  saveServers: (servers) => dispatch(doCacheCustomWalletServers(servers)),
  fetchDaemonSettings: () => dispatch(doFetchDaemonSettings()),
});

export default connect(
  select,
  perform
)(SettingWalletServer);
