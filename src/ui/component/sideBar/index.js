import { connect } from 'react-redux';
import { selectNavLinks } from 'redux/selectors/app';
import { selectUnreadAmount } from 'redux/selectors/subscriptions';
import SideBar from './view';

const select = state => ({
  navLinks: selectNavLinks(state),
  unreadSubscriptionTotal: selectUnreadAmount(state),
});

const perform = () => ({});

export default connect(
  select,
  perform
)(SideBar);
