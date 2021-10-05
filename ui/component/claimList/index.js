import { connect } from 'react-redux';
import ClaimList from './view';
import { SETTINGS } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = (state) => ({
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
});

export default connect(select)(ClaimList);
