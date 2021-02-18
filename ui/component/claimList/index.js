import { connect } from 'react-redux';
import ClaimList from './view';
import { SETTINGS } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = (state) => ({
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
});

const perform = (dispatch) => ({});

export default connect(select, perform)(ClaimList);
