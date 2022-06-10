import { connect } from 'react-redux';
import { selectUnseenNotificationCount } from 'redux/selectors/notifications';
import { selectUser } from 'redux/selectors/user';
import NotificationButton from './view';

const select = (state) => ({
  unseenCount: selectUnseenNotificationCount(state),
  user: selectUser(state),
});

export default connect(select)(NotificationButton);
