import { connect } from 'react-redux';
import { doSetDaemonSetting, doGetDaemonStatus, doCleanBlobs } from 'redux/actions/settings';
import { selectDaemonStatus, selectDaemonSettings } from 'redux/selectors/settings';
import SettingWalletServer from './view';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  daemonStatus: selectDaemonStatus(state),
});

const perform = (dispatch) => ({
  getDaemonStatus: () => dispatch(doGetDaemonStatus()),
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  cleanBlobs: () => dispatch(doCleanBlobs()),
});

export default connect(select, perform)(SettingWalletServer);
