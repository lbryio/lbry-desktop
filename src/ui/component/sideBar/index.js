import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectFollowedTags } from 'lbry-redux';
import SideBar from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { SETTINGS } from 'lbry-redux';

const select = state => ({
  subscriptions: selectSubscriptions(state),
  followedTags: selectFollowedTags(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
});

const perform = () => ({});

export default connect(
  select,
  perform
)(SideBar);
