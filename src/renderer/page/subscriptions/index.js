import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import {
  selectSubscriptionClaims,
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectUnreadSubscriptions,
  selectViewMode,
} from 'redux/selectors/subscriptions';
import {
  doUpdateUnreadSubscriptions,
  doFetchMySubscriptions,
  doSetViewMode,
} from 'redux/actions/subscriptions';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SubscriptionsPage from './view';

const select = state => ({
  loading:
    selectIsFetchingSubscriptions(state) ||
    Boolean(Object.keys(selectSubscriptionsBeingFetched(state)).length),
  subscribedChannels: selectSubscriptions(state),
  autoDownload: makeSelectClientSetting(settings.AUTO_DOWNLOAD)(state),
  allSubscriptions: selectSubscriptionClaims(state),
  unreadSubscriptions: selectUnreadSubscriptions(state),
  viewMode: selectViewMode(state),
});

export default connect(
  select,
  {
    doUpdateUnreadSubscriptions,
    doFetchMySubscriptions,
    doSetClientSetting,
    doSetViewMode,
  }
)(SubscriptionsPage);
