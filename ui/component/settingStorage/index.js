import { connect } from 'react-redux';
import { doWalletStatus } from 'redux/actions/wallet';
import { doClearCache } from 'redux/actions/app';
import { doSetDaemonSetting, doClearDaemonSetting, doCleanBlobs } from 'redux/actions/settings';
import { selectDaemonSettings, selectDaemonStatus, selectSettingDaemonSettings } from 'redux/selectors/settings';

import SettingStorage from './view';
import { selectDiskSpace } from 'redux/selectors/app';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  diskSpace: selectDiskSpace(state),
  daemonStatus: selectDaemonStatus(state),
  isSetting: selectSettingDaemonSettings(state),
});

const perform = (dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearDaemonSetting: (key) => dispatch(doClearDaemonSetting(key)),
  clearCache: () => dispatch(doClearCache()),
  cleanBlobs: () => dispatch(doCleanBlobs()),
  updateWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(select, perform)(SettingStorage);
