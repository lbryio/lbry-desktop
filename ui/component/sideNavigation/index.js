import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectPurchaseUriSuccess, doClearPurchasedUriSuccess, SETTINGS } from 'lbry-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSignOut } from 'redux/actions/app';
import { selectUnreadNotificationCount } from 'redux/selectors/notifications';

import SideNavigation from './view';

const select = state => ({
  subscriptions: selectSubscriptions(state),
  followedTags: selectFollowedTags(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  email: selectUserVerifiedEmail(state),
  purchaseSuccess: selectPurchaseUriSuccess(state),
  unreadCount: selectUnreadNotificationCount(state),
  user: selectUser(state),
});

export default connect(select, {
  doSignOut,
  doClearPurchasedUriSuccess,
})(SideNavigation);
