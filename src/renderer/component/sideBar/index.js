import { connect } from 'react-redux';
import { selectNavLinks } from 'lbry-redux';
import { selectNotifications } from 'redux/selectors/subscriptions';
import SideBar from './view';

const select = state => ({
  navLinks: selectNavLinks(state),
  notifications: selectNotifications(state),
});

const perform = () => ({});

export default connect(
  select,
  perform
)(SideBar);
