import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';

import SettingUnauthenticated from './view';

const select = (state) => ({
  searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
});

const perform = (dispatch) => ({
  setSearchInLanguage: (value) => dispatch(doSetClientSetting(SETTINGS.SEARCH_IN_LANGUAGE, value)),
});

export default connect(select, perform)(SettingUnauthenticated);
