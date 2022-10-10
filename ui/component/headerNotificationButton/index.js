import { connect } from 'react-redux';
import { selectNotifications, selectUnseenNotificationCount } from 'redux/selectors/notifications';
import {
  doReadNotifications,
  doSeeNotifications,
  doDeleteNotification,
  doSeeAllNotifications,
} from 'redux/actions/notifications';
import { selectUser, selectUserVerifiedEmail } from 'redux/selectors/user';
import { doGetMembershipSupportersList } from 'redux/actions/memberships';
import NotificationHeaderButton from './view';

const select = (state) => ({
  notifications: selectNotifications(state),
  unseenCount: selectUnseenNotificationCount(state),
  user: selectUser(state),
  authenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch, ownProps) => ({
  readNotification: ([id]) => dispatch(doReadNotifications([id])),
  seeNotification: ([id]) => dispatch(doSeeNotifications([id])),
  deleteNotification: (id) => dispatch(doDeleteNotification(id)),
  doSeeAllNotifications: () => dispatch(doSeeAllNotifications()),
  doGetMembershipSupportersList: () => dispatch(doGetMembershipSupportersList()),
});

export default connect(select, perform)(NotificationHeaderButton);
