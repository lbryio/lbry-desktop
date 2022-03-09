import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';
import HeaderMenuButtons from './view';
import { selectUserVerifiedEmail, selectUser, selectOdyseeMembershipName } from 'redux/selectors/user';
import { doOpenModal } from 'redux/actions/app';

const select = (state) => ({
  authenticated: selectUserVerifiedEmail(state),
  automaticDarkModeEnabled: selectClientSetting(state, SETTINGS.AUTOMATIC_DARK_MODE_ENABLED),
  currentTheme: selectClientSetting(state, SETTINGS.THEME),
  user: selectUser(state),
  odyseeMembership: selectOdyseeMembershipName(state),
});

const perform = (dispatch) => ({
  handleThemeToggle: (automaticDarkModeEnabled, currentTheme) => {
    if (automaticDarkModeEnabled) dispatch(doSetClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, false));
    dispatch(doSetClientSetting(SETTINGS.THEME, currentTheme === 'dark' ? 'light' : 'dark', true));
  },
  doOpenModal: (id, params) => dispatch(doOpenModal(id, params)),
});

export default connect(select, perform)(HeaderMenuButtons);
