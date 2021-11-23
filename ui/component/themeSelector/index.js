import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting, doSetDarkTime } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import ThemeSelector from './view';

const select = (state) => ({
  currentTheme: selectClientSetting(state, SETTINGS.THEME),
  themes: selectClientSetting(state, SETTINGS.THEMES),
  automaticDarkModeEnabled: selectClientSetting(state, SETTINGS.AUTOMATIC_DARK_MODE_ENABLED),
  darkModeTimes: selectClientSetting(state, SETTINGS.DARK_MODE_TIMES),
  clock24h: selectClientSetting(state, SETTINGS.CLOCK_24H),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  setDarkTime: (time, options) => dispatch(doSetDarkTime(time, options)),
});

export default connect(select, perform)(ThemeSelector);
