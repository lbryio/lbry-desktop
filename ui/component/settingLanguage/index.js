import { connect } from 'react-redux';
import { SETTINGS } from 'lbry-redux';
import { doSetLanguage, doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting, selectLanguage } from 'redux/selectors/settings';
import SettingLanguage from './view';

const select = state => ({
  language: selectLanguage(state),
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
});

const perform = dispatch => ({
  setLanguage: value => dispatch(doSetLanguage(value)),
  setSearchInLanguage: value => dispatch(doSetClientSetting(SETTINGS.SEARCH_IN_LANGUAGE, value)),
});

export default connect(select, perform)(SettingLanguage);
