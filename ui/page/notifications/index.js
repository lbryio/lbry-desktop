import { connect } from 'react-redux';
import {
  selectNotifications,
  selectNotificationsFiltered,
  selectIsFetchingNotifications,
  selectUnreadNotificationCount,
  selectUnseenNotificationCount,
  selectNotificationCategories,
} from 'redux/selectors/notifications';
import { doCommentReactList } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import {
  doReadNotifications,
  doNotificationList,
  doSeeAllNotifications,
  doNotificationCategories,
} from 'redux/actions/notifications';
import NotificationsPage from './view';

const select = (state) => ({
  notifications: selectNotifications(state),
  notificationsFiltered: selectNotificationsFiltered(state),
  notificationCategories: selectNotificationCategories(state),
  fetching: selectIsFetchingNotifications(state),
  unreadCount: selectUnreadNotificationCount(state),
  unseenCount: selectUnseenNotificationCount(state),
  activeChannel: selectActiveChannelClaim(state),
});

export default connect(select, {
  doReadNotifications,
  doNotificationList,
  doNotificationCategories,
  doSeeAllNotifications,
  doCommentReactList,
})(NotificationsPage);
