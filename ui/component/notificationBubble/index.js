import { connect } from 'react-redux';
import { selectUnreadNotificationCount } from 'redux/selectors/notifications';
import { selectUser } from 'redux/selectors/user';
import NotificationBubble from './view';

const select = state => ({
  unreadCount: selectUnreadNotificationCount(state),
  user: selectUser(state),
});

export default connect(select)(NotificationBubble);
