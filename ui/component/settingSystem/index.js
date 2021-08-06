import { connect } from 'react-redux';
import { doClearCache } from 'redux/actions/app';
import { doSetDaemonSetting } from 'redux/actions/settings';
import { selectDaemonSettings } from 'redux/selectors/settings';
import SettingSystem from './view';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
});

const perform = (dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearCache: () => dispatch(doClearCache()),
});

export default connect(select, perform)(SettingSystem);
