import { connect } from 'react-redux';
import {
  selectSubscriptionClaims,
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectSuggestedChannels,
} from 'redux/selectors/subscriptions';
import { doFetchMySubscriptions, doFetchRecommendedSubscriptions } from 'redux/actions/subscriptions';
import SubscriptionsPage from './view';

const select = state => ({
  loading: selectIsFetchingSubscriptions(state) || Boolean(Object.keys(selectSubscriptionsBeingFetched(state)).length),
  subscribedChannels: selectSubscriptions(state),
  subscriptionContent: selectSubscriptionClaims(state),
  suggestedSubscriptions: selectSuggestedChannels(state),
});

export default connect(
  select,
  {
    doFetchMySubscriptions,
    doFetchRecommendedSubscriptions,
  }
)(SubscriptionsPage);
