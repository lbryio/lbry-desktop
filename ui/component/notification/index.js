import { connect } from 'react-redux';
import { doReadNotifications, doDeleteNotification } from 'redux/actions/notifications';
import Notification from './view';

export default connect(null, {
  doReadNotifications,
  doDeleteNotification,
})(Notification);
