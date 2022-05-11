import { connect } from 'react-redux';
import { selectUnseenNotificationCount, selectUnseenLocalNotificationCount } from 'redux/selectors/notifications';
import { doLbryioSeeAllNotifications, doLocalSeeAllNotifications } from 'redux/actions/notifications';
import { selectUser } from 'redux/selectors/user';
import NotificationHeaderButton from './view';

const select = (state) => ({
  unseenCount: selectUnseenNotificationCount(state),
  unseenLocalCount: selectUnseenLocalNotificationCount(state),
  user: selectUser(state),
});

export default connect(select, {
  doLbryioSeeAllNotifications,
  doLocalSeeAllNotifications,
})(NotificationHeaderButton);
