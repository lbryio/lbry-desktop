import { connect } from 'react-redux';
import { selectUnreadNotificationCount } from 'redux/selectors/notifications';
import NotificationBubble from './view';

const select = state => ({
  unreadCount: selectUnreadNotificationCount(state),
});

export default connect(select)(NotificationBubble);
