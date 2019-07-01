import { connect } from 'react-redux';
import { doClaimSearch, selectLastClaimSearchUris, selectFetchingClaimSearch, doToggleTagFollow } from 'lbry-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import ClaimListDiscover from './view';

const select = state => ({
  uris: selectLastClaimSearchUris(state),
  loading: selectFetchingClaimSearch(state),
  subscribedChannels: selectSubscriptions(state),
});

const perform = {
  doClaimSearch,
  doToggleTagFollow,
};

export default connect(
  select,
  perform
)(ClaimListDiscover);
