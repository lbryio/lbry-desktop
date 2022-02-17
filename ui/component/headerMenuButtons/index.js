import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectActiveChannelStakedLevel } from 'redux/selectors/app';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';
import HeaderMenuButtons from './view';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';

const select = (state) => ({
  activeChannelStakedLevel: selectActiveChannelStakedLevel(state),
  authenticated: selectUserVerifiedEmail(state),
  automaticDarkModeEnabled: selectClientSetting(state, SETTINGS.AUTOMATIC_DARK_MODE_ENABLED),
  currentTheme: selectClientSetting(state, SETTINGS.THEME),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  handleThemeToggle: (automaticDarkModeEnabled, currentTheme) => {
    if (automaticDarkModeEnabled) dispatch(doSetClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, false));
    dispatch(doSetClientSetting(SETTINGS.THEME, currentTheme === 'dark' ? 'light' : 'dark', true));
  },
});

export default connect(select, perform)(HeaderMenuButtons);
