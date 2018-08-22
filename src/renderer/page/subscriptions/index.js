import { connect } from 'react-redux';
import {
  selectSubscriptionClaims,
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectNotifications,
} from 'redux/selectors/subscriptions';
import { setSubscriptionNotifications, doFetchMySubscriptions } from 'redux/actions/subscriptions';
import SubscriptionsPage from './view';

const select = state => ({
  loading:
    selectIsFetchingSubscriptions(state) ||
    Boolean(Object.keys(selectSubscriptionsBeingFetched(state)).length),
  subscriptions: selectSubscriptions(state),
  subscriptionClaims: selectSubscriptionClaims(state),
  notifications: selectNotifications(state),
});

export default connect(
  select,
  {
    setSubscriptionNotifications,
    doFetchMySubscriptions,
  }
)(SubscriptionsPage);
