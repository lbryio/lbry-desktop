import { connect } from 'react-redux';
import { doClearCache } from 'redux/actions/app';
import { doSetDaemonSetting, doClearDaemonSetting, doFindFFmpeg } from 'redux/actions/settings';
import { selectDaemonSettings, selectFfmpegStatus, selectFindingFFmpeg } from 'redux/selectors/settings';
import SettingSystem from './view';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  ffmpegStatus: selectFfmpegStatus(state),
  findingFFmpeg: selectFindingFFmpeg(state),
});

const perform = (dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearDaemonSetting: (key) => dispatch(doClearDaemonSetting(key)),
  clearCache: () => dispatch(doClearCache()),
  findFFmpeg: () => dispatch(doFindFFmpeg()),
});

export default connect(select, perform)(SettingSystem);
