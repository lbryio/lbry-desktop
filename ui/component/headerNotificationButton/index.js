import { connect } from 'react-redux';
import { selectUnseenNotificationCount } from 'redux/selectors/notifications';
import { doSeeAllNotifications } from 'redux/actions/notifications';
import NotificationHeaderButton from './view';

const select = (state) => ({
  unseenCount: selectUnseenNotificationCount(state),
});

export default connect(select, {
  doSeeAllNotifications,
})(NotificationHeaderButton);
