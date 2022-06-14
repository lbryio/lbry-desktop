import { connect } from 'react-redux';
import { doReadNotifications, doDeleteNotification } from 'redux/actions/notifications';
import Notification from './view';

const perform = (dispatch, ownProps) => ({
  readNotification: () => dispatch(doReadNotifications([ownProps.notification.id])),
  deleteNotification: () => dispatch(doDeleteNotification(ownProps.notification.id)),
});

export default connect(null, perform)(Notification);
