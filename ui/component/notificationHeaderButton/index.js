import { connect } from 'react-redux';
import {
  selectNotifications,
  selectIsFetchingNotifications,
  selectUnreadNotificationCount,
} from 'redux/selectors/notifications';
import { doReadNotifications } from 'redux/actions/notifications';
import { selectUser } from 'redux/selectors/user';
import NotificationHeaderButton from './view';

const select = state => ({
  notifications: selectNotifications(state),
  fetching: selectIsFetchingNotifications(state),
  unreadCount: selectUnreadNotificationCount(state),
  user: selectUser(state),
});

export default connect(select, {
  doReadNotifications,
})(NotificationHeaderButton);
