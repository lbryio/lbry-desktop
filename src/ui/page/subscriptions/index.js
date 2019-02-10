import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import {
  selectSubscriptionClaims,
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectUnreadSubscriptions,
  selectViewMode,
  selectFirstRunCompleted,
  selectshowSuggestedSubs,
} from 'redux/selectors/subscriptions';
import {
  doFetchMySubscriptions,
  doSetViewMode,
  doFetchRecommendedSubscriptions,
  doCompleteFirstRun,
  doShowSuggestedSubs,
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
  firstRunCompleted: selectFirstRunCompleted(state),
  showSuggestedSubs: selectshowSuggestedSubs(state),
});

export default connect(
  select,
  {
    doFetchMySubscriptions,
    doSetClientSetting,
    doSetViewMode,
    doFetchRecommendedSubscriptions,
    doCompleteFirstRun,
    doShowSuggestedSubs,
  }
)(SubscriptionsPage);
