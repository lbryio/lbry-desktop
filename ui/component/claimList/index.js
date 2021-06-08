import { connect } from 'react-redux';
import ClaimList from './view';
import { SETTINGS, selectClaimSearchByQuery, selectClaimsByUri } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = (state) => ({
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
  claimSearchByQuery: selectClaimSearchByQuery(state),
  claimsByUri: selectClaimsByUri(state),
});

export default connect(select)(ClaimList);
