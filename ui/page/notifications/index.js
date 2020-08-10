import { connect } from 'react-redux';
import {
  selectNotifications,
  selectIsFetchingNotifications,
  selectUnreadNotificationCount,
} from 'redux/selectors/notifications';
import { doReadNotifications } from 'redux/actions/notifications';
import NotificationsPage from './view';

const select = state => ({
  notifications: selectNotifications(state),
  fetching: selectIsFetchingNotifications(state),
  unreadCount: selectUnreadNotificationCount(state),
});

export default connect(select, {
  doReadNotifications,
})(NotificationsPage);
