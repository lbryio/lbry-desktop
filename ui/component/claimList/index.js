import { connect } from 'react-redux';
import ClaimList from './view';
import * as SETTINGS from 'constants/settings';

import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = (state) => ({
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
});

export default connect(select)(ClaimList);
