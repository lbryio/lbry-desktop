import { connect } from 'react-redux';
import {
  doClaimSearch,
  selectClaimSearchByQuery,
  selectClaimSearchByQueryLastPageReached,
  selectFetchingClaimSearch,
  SETTINGS,
} from 'lbry-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting, selectShowMatureContent, selectLanguage } from 'redux/selectors/settings';
import { selectModerationBlockList } from 'redux/selectors/comments';
import ClaimListDiscover from './view';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  claimSearchByQuery: selectClaimSearchByQuery(state),
  claimSearchByQueryLastPageReached: selectClaimSearchByQueryLastPageReached(state),
  loading: selectFetchingClaimSearch(state),
  showNsfw: selectShowMatureContent(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  languageSetting: selectLanguage(state),
  mutedUris: selectMutedChannels(state),
  blockedUris: selectModerationBlockList(state),
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
});

const perform = {
  doClaimSearch,
  doToggleTagFollowDesktop,
};

export default connect(select, perform)(ClaimListDiscover);
