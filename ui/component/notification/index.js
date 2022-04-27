import { connect } from 'react-redux';
import { doLbryioNotificationsMarkRead, doLbryioDeleteNotification } from 'redux/actions/notifications';
import Notification from './view';

const perform = (dispatch, ownProps) => ({
  readNotification: () => dispatch(doLbryioNotificationsMarkRead([ownProps.notification.id])),
  deleteNotification: () => dispatch(doLbryioDeleteNotification(ownProps.notification.id)),
});

export default connect(null, perform)(Notification);
