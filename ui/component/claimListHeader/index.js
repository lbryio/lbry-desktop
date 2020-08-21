import { connect } from 'react-redux';
import { selectFetchingClaimSearch, SETTINGS, selectFollowedTags } from 'lbry-redux';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting, doSyncClientSettings } from 'redux/actions/settings';

import ClaimListDiscover from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  loading: selectFetchingClaimSearch(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
});

const perform = {
  doToggleTagFollowDesktop,
  doSetClientSetting,
  doSyncClientSettings,
};

export default connect(select, perform)(ClaimListDiscover);
