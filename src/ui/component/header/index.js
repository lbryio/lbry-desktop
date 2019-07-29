import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectBalance, SETTINGS as LBRY_REDUX_SETTINGS } from 'lbry-redux';
import { formatCredits } from 'util/format-credits';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import Header from './view';

const select = state => ({
  balance: selectBalance(state),
  language: makeSelectClientSetting(LBRY_REDUX_SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  roundedBalance: formatCredits(selectBalance(state) || 0, 2),
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED)(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
});

const perform = dispatch => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(
  select,
  perform
)(Header);
