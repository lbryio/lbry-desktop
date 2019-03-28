import { connect } from 'react-redux';
import { selectUnreadAmount } from 'redux/selectors/subscriptions';
import SideBar from './view';

const select = state => ({
  unreadSubscriptionTotal: selectUnreadAmount(state),
});

const perform = () => ({});

export default connect(
  select,
  perform
)(SideBar);
