import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetAppToTrayWhenClosed } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import SettingClosingBehavior from './view';

const select = (state) => ({
  toTrayWhenClosed: selectClientSetting(state, SETTINGS.TO_TRAY_WHEN_CLOSED),
});

const perform = (dispatch) => ({
  setToTrayWhenClosed: (value) => dispatch(doSetAppToTrayWhenClosed(value)),
});

export default connect(select, perform)(SettingClosingBehavior);
