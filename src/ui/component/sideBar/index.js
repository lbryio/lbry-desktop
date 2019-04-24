import { connect } from 'react-redux';
import { selectUnreadAmount } from 'redux/selectors/subscriptions';
import { selectShouldShowInviteGuide } from 'redux/selectors/app';
import SideBar from './view';

const select = state => ({
  unreadSubscriptionTotal: selectUnreadAmount(state),
  shouldShowInviteGuide: selectShouldShowInviteGuide(state),
});

const perform = () => ({});

export default connect(
  select,
  perform
)(SideBar);
