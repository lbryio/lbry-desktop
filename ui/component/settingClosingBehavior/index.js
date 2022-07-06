import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetAppToTrayWhenClosed } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SettingClosingBehavior from './view';

const select = (state) => ({
  toTrayWhenClosed: makeSelectClientSetting(SETTINGS.TO_TRAY_WHEN_CLOSED)(state),
});

const perform = (dispatch) => ({
  setToTrayWhenClosed: (value) => dispatch(doSetAppToTrayWhenClosed(value)),
});

export default connect(select, perform)(SettingClosingBehavior);
