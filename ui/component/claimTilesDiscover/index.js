import { connect } from 'react-redux';
import { doClaimSearch, selectClaimSearchByQuery, selectFetchingClaimSearchByQuery, SETTINGS } from 'lbry-redux';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting, selectShowMatureContent } from 'redux/selectors/settings';
import ClaimListDiscover from './view';

const select = (state) => ({
  claimSearchByQuery: selectClaimSearchByQuery(state),
  fetchingClaimSearchByQuery: selectFetchingClaimSearchByQuery(state),
  showNsfw: selectShowMatureContent(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
});

const perform = {
  doClaimSearch,
  doToggleTagFollowDesktop,
};

export default connect(select, perform)(ClaimListDiscover);
