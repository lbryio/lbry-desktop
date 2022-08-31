import { connect } from 'react-redux';
import {
  selectClaimsByUri,
  selectClaimSearchByQuery,
  selectClaimSearchByQueryLastPageReached,
  selectFetchingClaimSearch,
} from 'redux/selectors/claims';
import { doClaimSearch } from 'redux/actions/claims';
import * as SETTINGS from 'constants/settings';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting, selectShowMatureContent, selectLanguage } from 'redux/selectors/settings';
import { selectModerationBlockList } from 'redux/selectors/comments';
import ClaimListDiscover from './view';
import { doFetchViewCount } from 'lbryinc';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  claimSearchByQuery: selectClaimSearchByQuery(state),
  claimSearchByQueryLastPageReached: selectClaimSearchByQueryLastPageReached(state),
  claimsByUri: selectClaimsByUri(state),
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
  doFetchViewCount,
};

export default connect(select, perform)(ClaimListDiscover);
