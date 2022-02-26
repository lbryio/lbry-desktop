import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import SettingAppearance from './view';

const select = (state) => ({
  clock24h: selectClientSetting(state, SETTINGS.CLOCK_24H),
  searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
  isAuthenticated: selectUserVerifiedEmail(state),
  hideBalance: selectClientSetting(state, SETTINGS.HIDE_BALANCE),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  setSearchInLanguage: (value) => dispatch(doSetClientSetting(SETTINGS.SEARCH_IN_LANGUAGE, value)),
});

export default connect(select, perform)(SettingAppearance);
