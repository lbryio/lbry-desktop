import ChannelFinder from './view';
import { connect } from 'react-redux';
import { doResolveUris } from 'redux/actions/claims';
import { doSetMentionSearchResults } from 'redux/actions/search';
import { selectClaimsByUri, selectResolvingUris } from 'redux/selectors/claims';
import { selectSubscriptionUris } from 'redux/selectors/subscriptions';

const select = (state, props) => ({
  claimsByUri: selectClaimsByUri(state),
  resolvingUris: selectResolvingUris(state),
  subscriptionUris: selectSubscriptionUris(state) || [],
});

const perform = {
  doResolveUris,
  doSetMentionSearchResults,
};

export default connect(select, perform)(ChannelFinder);
