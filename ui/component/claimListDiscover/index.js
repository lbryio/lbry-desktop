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
import { selectClientSetting, selectShowMatureContent, selectLanguage } from 'redux/selectors/settings';
import { selectModerationBlockList } from 'redux/selectors/comments';
import ClaimListDiscover from './view';
import { doFetchViewCount } from 'lbryinc';

const select = (state, props) => ({
  followedTags: selectFollowedTags(state),
  claimSearchByQuery: selectClaimSearchByQuery(state),
  claimSearchByQueryLastPageReached: selectClaimSearchByQueryLastPageReached(state),
  claimsByUri: selectClaimsByUri(state),
  loading: props.loading !== undefined ? props.loading : selectFetchingClaimSearch(state),
  showNsfw: selectShowMatureContent(state),
  hideReposts: selectClientSetting(state, SETTINGS.HIDE_REPOSTS),
  languageSetting: selectLanguage(state),
  mutedUris: selectMutedChannels(state),
  blockedUris: selectModerationBlockList(state),
  searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
});

const perform = {
  doClaimSearch,
  doToggleTagFollowDesktop,
  doFetchViewCount,
};

export default connect(select, perform)(ClaimListDiscover);
