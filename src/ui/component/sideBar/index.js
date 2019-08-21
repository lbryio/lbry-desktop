import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectFollowedTags } from 'lbry-redux';
import { selectUserEmail } from 'lbryinc';
import SideBar from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = state => ({
  subscriptions: selectSubscriptions(state),
  followedTags: selectFollowedTags(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  email: selectUserEmail(state),
});

const perform = () => ({});

export default connect(
  select,
  perform
)(SideBar);
