import { connect } from 'react-redux';
import {
  selectNotifications,
  selectIsFetchingNotifications,
  selectUnreadNotificationCount,
  selectUnseenNotificationCount,
} from 'redux/selectors/notifications';
import { doReadNotifications, doNotificationList, doSeeAllNotifications } from 'redux/actions/notifications';
import NotificationsPage from './view';

const select = state => ({
  notifications: selectNotifications(state),
  fetching: selectIsFetchingNotifications(state),
  unreadCount: selectUnreadNotificationCount(state),
  unseenCount: selectUnseenNotificationCount(state),
});

export default connect(select, {
  doReadNotifications,
  doNotificationList,
  doSeeAllNotifications,
})(NotificationsPage);
