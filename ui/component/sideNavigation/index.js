import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectPurchaseUriSuccess, doClearPurchasedUriSuccess } from 'lbry-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';
import { selectHomepageData, selectLanguage } from 'redux/selectors/settings';
import { doSignOut } from 'redux/actions/app';
import { selectUnreadNotificationCount } from 'redux/selectors/notifications';

import SideNavigation from './view';

const select = state => ({
  subscriptions: selectSubscriptions(state),
  followedTags: selectFollowedTags(state),
  language: selectLanguage(state), // trigger redraw on language change
  email: selectUserVerifiedEmail(state),
  purchaseSuccess: selectPurchaseUriSuccess(state),
  unreadCount: selectUnreadNotificationCount(state),
  user: selectUser(state),
  homepageData: selectHomepageData(state),
});

export default connect(select, {
  doSignOut,
  doClearPurchasedUriSuccess,
})(SideNavigation);
