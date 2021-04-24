import { connect } from 'react-redux';
import { doClaimSearch, selectClaimSearchByQuery, selectFetchingClaimSearchByQuery, SETTINGS } from 'lbry-redux';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting, selectShowMatureContent } from 'redux/selectors/settings';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { selectMutedChannels } from 'redux/selectors/blocked';
import ClaimListDiscover from './view';

const select = (state) => ({
  claimSearchByQuery: selectClaimSearchByQuery(state),
  fetchingClaimSearchByQuery: selectFetchingClaimSearchByQuery(state),
  showNsfw: selectShowMatureContent(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  mutedUris: selectMutedChannels(state),
  blockedUris: selectModerationBlockList(state),
});

const perform = {
  doClaimSearch,
  doToggleTagFollowDesktop,
};

export default connect(select, perform)(ClaimListDiscover);
