import { connect } from 'react-redux';
import { selectFetchingClaimSearch } from 'redux/selectors/claims';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectClientSetting, selectShowMatureContent, selectLanguage } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import * as SETTINGS from 'constants/settings';
import ClaimListHeader from './view';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  loading: selectFetchingClaimSearch(state),
  showNsfw: selectShowMatureContent(state),
  searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
  languageSetting: selectLanguage(state),
});

const perform = {
  doSetClientSetting,
};

export default connect(select, perform)(ClaimListHeader);
