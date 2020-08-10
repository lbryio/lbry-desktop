import { connect } from 'react-redux';
import { selectUnreadNotificationCount } from 'redux/selectors/notifications';
import NotificationHeaderButton from './view';

const select = state => ({
  unreadCount: selectUnreadNotificationCount(state),
});

export default connect(select)(NotificationHeaderButton);
