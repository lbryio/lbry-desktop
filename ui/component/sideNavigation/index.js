import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doFetchLastActiveSubs } from 'redux/actions/subscriptions';
import { selectLastActiveSubscriptions, selectSubscriptions } from 'redux/selectors/subscriptions';
import { doClearClaimSearch } from 'redux/actions/claims';
import { doClearPurchasedUriSuccess } from 'redux/actions/file';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectUserVerifiedEmail, selectUser, selectHasOdyseeMembership } from 'redux/selectors/user';
import { selectClientSetting, selectHomepageData } from 'redux/selectors/settings';
import { doOpenModal, doSignOut } from 'redux/actions/app';
import { selectUnseenNotificationCount } from 'redux/selectors/notifications';
import { selectPurchaseUriSuccess } from 'redux/selectors/claims';

import SideNavigation from './view';

const select = (state) => ({
  subscriptions: selectSubscriptions(state),
  lastActiveSubs: selectLastActiveSubscriptions(state),
  followedTags: selectFollowedTags(state),
  email: selectUserVerifiedEmail(state),
  purchaseSuccess: selectPurchaseUriSuccess(state),
  unseenCount: selectUnseenNotificationCount(state),
  user: selectUser(state),
  homepageData: selectHomepageData(state),
  homepageOrder: selectClientSetting(state, SETTINGS.HOMEPAGE_ORDER),
  homepageOrderApplyToSidebar: selectClientSetting(state, SETTINGS.HOMEPAGE_ORDER_APPLY_TO_SIDEBAR),
  hasMembership: selectHasOdyseeMembership(state),
});

export default connect(select, {
  doClearClaimSearch,
  doSignOut,
  doClearPurchasedUriSuccess,
  doFetchLastActiveSubs,
  doOpenModal,
})(SideNavigation);
