import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectFollowedTags } from 'lbry-redux';
import { selectUploadCount, selectUserVerifiedEmail } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSignOut } from 'redux/actions/app';
import SideNavigation from './view';

const select = state => ({
  subscriptions: selectSubscriptions(state),
  followedTags: selectFollowedTags(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  uploadCount: selectUploadCount(state),
  email: selectUserVerifiedEmail(state),
});

export default connect(select, {
  doSignOut,
})(SideNavigation);
