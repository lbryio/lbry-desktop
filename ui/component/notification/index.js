import { connect } from 'react-redux';

import { doReadNotifications, doDeleteNotification } from 'redux/actions/notifications';
import { doGetMembershipSupportersList } from 'redux/actions/memberships';

import Notification from './view';

const perform = {
  doReadNotifications,
  doDeleteNotification,
  doGetMembershipSupportersList,
};

export default connect(null, perform)(Notification);
