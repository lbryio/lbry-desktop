import { connect } from 'react-redux';
import { doClaimSearch, selectClaimSearchByQuery, selectFetchingClaimSearchByQuery, SETTINGS } from 'lbry-redux';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import ClaimListDiscover from './view';

const select = (state) => ({
  claimSearchByQuery: selectClaimSearchByQuery(state),
  fetchingClaimSearchByQuery: selectFetchingClaimSearchByQuery(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  hiddenUris: selectMutedChannels(state),
});

const perform = {
  doClaimSearch,
  doToggleTagFollowDesktop,
};

export default connect(select, perform)(ClaimListDiscover);
