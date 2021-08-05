import { connect } from 'react-redux';
import { SETTINGS } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SettingAppearance from './view';

const select = (state) => ({
  clock24h: makeSelectClientSetting(SETTINGS.CLOCK_24H)(state),
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  setSearchInLanguage: (value) => dispatch(doSetClientSetting(SETTINGS.SEARCH_IN_LANGUAGE, value)),
});

export default connect(select, perform)(SettingAppearance);
