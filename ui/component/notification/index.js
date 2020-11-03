import { connect } from 'react-redux';
import { doSeeNotifications, doDeleteNotification } from 'redux/actions/notifications';
import Notification from './view';

export default connect(null, {
  doSeeNotifications,
  doDeleteNotification,
})(Notification);
