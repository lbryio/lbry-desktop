import { connect } from 'react-redux';
import { doSetDaemonSetting, doGetDaemonStatus, doCleanBlobs } from 'redux/actions/settings';
import { selectDaemonStatus, selectDaemonSettings, selectSettingDaemonSettings } from 'redux/selectors/settings';
import SettingWalletServer from './view';
import { selectDiskSpace } from 'redux/selectors/app';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  daemonStatus: selectDaemonStatus(state),
  diskSpace: selectDiskSpace(state),
  isSetting: selectSettingDaemonSettings(state),
});

const perform = (dispatch) => ({
  getDaemonStatus: () => dispatch(doGetDaemonStatus()),
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  cleanBlobs: () => dispatch(doCleanBlobs(false)),
});

export default connect(select, perform)(SettingWalletServer);
