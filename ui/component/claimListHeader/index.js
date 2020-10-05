import { connect } from 'react-redux';
import { selectFetchingClaimSearch, SETTINGS } from 'lbry-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import ClaimListDiscover from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  loading: selectFetchingClaimSearch(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
});

const perform = {
  doToggleTagFollowDesktop,
  doSetClientSetting,
};

export default connect(select, perform)(ClaimListDiscover);
