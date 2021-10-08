import { connect } from 'react-redux';
import { selectIsWalletReconnecting } from 'redux/selectors/wallet';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import {
  doSetDaemonSetting,
  doClearDaemonSetting,
  doGetDaemonStatus,
  doSaveCustomWalletServers,
} from 'redux/actions/settings';
import { selectSavedWalletServers, selectDaemonStatus, selectHasWalletServerPrefs } from 'redux/selectors/settings';
import SettingWalletServer from './view';

const select = (state) => ({
  daemonStatus: selectDaemonStatus(state),
  customWalletServers: selectSavedWalletServers(state),
  hasWalletServerPrefs: selectHasWalletServerPrefs(state),
  walletReconnecting: selectIsWalletReconnecting(state),
});

const perform = (dispatch) => ({
  setCustomWalletServers: (value) => dispatch(doSetDaemonSetting(DAEMON_SETTINGS.LBRYUM_SERVERS, value)),
  clearWalletServers: () => dispatch(doClearDaemonSetting(DAEMON_SETTINGS.LBRYUM_SERVERS)),
  getDaemonStatus: () => dispatch(doGetDaemonStatus()),
  saveServerConfig: (servers) => dispatch(doSaveCustomWalletServers(servers)),
});

export default connect(select, perform)(SettingWalletServer);
