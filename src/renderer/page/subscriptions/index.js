import { connect } from 'react-redux';
import {
  selectSubscriptionClaims,
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectNotifications,
} from 'redux/selectors/subscriptions';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import { setSubscriptionNotifications, doFetchMySubscriptions } from 'redux/actions/subscriptions';
import SubscriptionsPage from './view';

const select = state => ({
  isFetchingSubscriptions: selectIsFetchingSubscriptions(state),
  subscriptionsBeingFetched: selectSubscriptionsBeingFetched(state),
  subscriptions: selectSubscriptions(state),
  subscriptionClaims: selectSubscriptionClaims(state),
  notifications: selectNotifications(state),
});

export default connect(select, {
  doFetchClaimsByChannel,
  setSubscriptionNotifications,
  doFetchMySubscriptions,
})(SubscriptionsPage);
