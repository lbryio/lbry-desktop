import { connect } from 'react-redux';
import {
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectSuggestedChannels,
} from 'redux/selectors/subscriptions';
import { doFetchMySubscriptions, doFetchRecommendedSubscriptions } from 'redux/actions/subscriptions';
import { selectLastClaimSearchUris, doClaimSearch } from 'lbry-redux';
import SubscriptionsPage from './view';

const select = state => ({
  loading: selectIsFetchingSubscriptions(state) || Boolean(Object.keys(selectSubscriptionsBeingFetched(state)).length),
  subscribedChannels: selectSubscriptions(state),
  suggestedSubscriptions: selectSuggestedChannels(state),
  uris: selectLastClaimSearchUris(state),
});

export default connect(
  select,
  {
    doFetchMySubscriptions,
    doFetchRecommendedSubscriptions,
    doClaimSearch,
  }
)(SubscriptionsPage);
