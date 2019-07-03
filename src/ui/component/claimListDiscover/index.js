import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { doClaimSearch, selectLastClaimSearchUris, selectFetchingClaimSearch, doToggleTagFollow } from 'lbry-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import ClaimListDiscover from './view';

const select = state => ({
  uris: selectLastClaimSearchUris(state),
  loading: selectFetchingClaimSearch(state),
  subscribedChannels: selectSubscriptions(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_NSFW)(state),
});

const perform = {
  doClaimSearch,
  doToggleTagFollow,
};

export default connect(
  select,
  perform
)(ClaimListDiscover);
