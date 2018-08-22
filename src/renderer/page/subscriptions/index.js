import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import {
  selectSubscriptionClaims,
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectNotifications,
} from 'redux/selectors/subscriptions';
import { setSubscriptionNotifications, doFetchMySubscriptions } from 'redux/actions/subscriptions';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SubscriptionsPage from './view';

const select = state => ({
  loading:
    selectIsFetchingSubscriptions(state) ||
    Boolean(Object.keys(selectSubscriptionsBeingFetched(state)).length),
  subscriptions: selectSubscriptions(state),
  subscriptionClaims: selectSubscriptionClaims(state),
  notifications: selectNotifications(state),
  autoDownload: makeSelectClientSetting(settings.AUTO_DOWNLOAD)(state),
});

export default connect(
  select,
  {
    setSubscriptionNotifications,
    doFetchMySubscriptions,
    doSetClientSetting,
  }
)(SubscriptionsPage);
