import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectFollowedTags, selectPurchaseUriSuccess, doClearPurchasedUriSuccess, SETTINGS } from 'lbry-redux';
import { selectUploadCount } from 'lbryinc';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSignOut } from 'redux/actions/app';
import SideNavigation from './view';

const select = state => ({
  subscriptions: selectSubscriptions(state),
  followedTags: selectFollowedTags(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  uploadCount: selectUploadCount(state),
  email: selectUserVerifiedEmail(state),
  purchaseSuccess: selectPurchaseUriSuccess(state),
});

export default connect(select, {
  doSignOut,
  doClearPurchasedUriSuccess,
})(SideNavigation);
