import { connect } from 'react-redux';
import { selectFetchingClaimSearch, SETTINGS } from 'lbry-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting, selectLanguage } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import ClaimListHeader from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  loading: selectFetchingClaimSearch(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
  searchInLanguage: makeSelectClientSetting(SETTINGS.SEARCH_IN_LANGUAGE)(state),
  languageSetting: selectLanguage(state),
});

const perform = {
  doToggleTagFollowDesktop,
  doSetClientSetting,
};

export default connect(select, perform)(ClaimListHeader);
