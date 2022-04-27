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
  doLbryioNotificationsMarkRead,
  doLbryioNotificationList,
  doLbryioSeeAllNotifications,
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
  doLbryioNotificationsMarkRead,
  doLbryioNotificationList,
  doLbryioSeeAllNotifications,
  doCommentReactList,
})(NotificationsPage);
