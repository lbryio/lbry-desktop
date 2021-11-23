import { connect } from 'react-redux';
import ClaimList from './view';
import * as SETTINGS from 'constants/settings';

import { selectClientSetting } from 'redux/selectors/settings';

const select = (state) => ({
  searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
});

export default connect(select)(ClaimList);
