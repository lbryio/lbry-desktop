import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectLanguage, makeSelectClientSetting } from 'redux/selectors/settings';

import SettingUnauthenticated from './view';

const select = (state) => ({
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
  language: selectLanguage(state),
});

const perform = (dispatch) => ({
  setSearchInLanguage: (value) => dispatch(doSetClientSetting(SETTINGS.SEARCH_IN_LANGUAGE, value)),
});

export default connect(select, perform)(SettingUnauthenticated);
