import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectPurchaseUriSuccess, doClearPurchasedUriSuccess, makeSelectClaimForUri } from 'lbry-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';
import { selectHomepageData, selectLanguage } from 'redux/selectors/settings';
import { doSignOut } from 'redux/actions/app';
import { selectUnseenNotificationCount } from 'redux/selectors/notifications';

import SideNavigation from './view';

const select = (state) => {
  const subscriptions = selectSubscriptions(state);
  return {
    claims: subscriptions.map(({ uri }) => (
      makeSelectClaimForUri(uri)(state)
      )),
    subscriptions,
    followedTags: selectFollowedTags(state),
    language: selectLanguage(state), // trigger redraw on language change
    email: selectUserVerifiedEmail(state),
    purchaseSuccess: selectPurchaseUriSuccess(state),
    unseenCount: selectUnseenNotificationCount(state),
    user: selectUser(state),
    homepageData: selectHomepageData(state),
  };
};

export default connect(select, {
  doSignOut,
  doClearPurchasedUriSuccess,
})(SideNavigation);
