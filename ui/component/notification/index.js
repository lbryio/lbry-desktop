import { connect } from 'react-redux';
import { doSeeNotifications } from 'redux/actions/notifications';
import Notification from './view';

export default connect(null, {
  doSeeNotifications,
})(Notification);
