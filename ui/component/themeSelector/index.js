import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting, doSetDarkTime } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import ThemeSelector from './view';

const select = (state) => ({
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  themes: makeSelectClientSetting(SETTINGS.THEMES)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED)(state),
  darkModeTimes: makeSelectClientSetting(SETTINGS.DARK_MODE_TIMES)(state),
  clock24h: makeSelectClientSetting(SETTINGS.CLOCK_24H)(state),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  setDarkTime: (time, options) => dispatch(doSetDarkTime(time, options)),
});

export default connect(select, perform)(ThemeSelector);
