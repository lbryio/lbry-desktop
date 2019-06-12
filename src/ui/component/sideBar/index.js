import { connect } from 'react-redux';
import { selectUnreadAmount } from 'redux/selectors/subscriptions';
import { selectShouldShowInviteGuide } from 'redux/selectors/app';
import SideBar from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { SETTINGS } from 'lbry-redux';

const select = state => ({
  unreadSubscriptionTotal: selectUnreadAmount(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  shouldShowInviteGuide: selectShouldShowInviteGuide(state),
});

const perform = () => ({});

export default connect(
  select,
  perform
)(SideBar);
