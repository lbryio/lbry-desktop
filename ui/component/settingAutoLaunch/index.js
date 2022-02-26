import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetAutoLaunch } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import { doToast } from 'redux/actions/notifications';
import SettingAutoLaunch from './view';

const select = (state) => ({
  autoLaunch: selectClientSetting(state, SETTINGS.AUTO_LAUNCH),
});

const perform = (dispatch) => ({
  showToast: (options) => dispatch(doToast(options)),
  setAutoLaunch: (value) => dispatch(doSetAutoLaunch(value)),
});

export default connect(select, perform)(SettingAutoLaunch);
