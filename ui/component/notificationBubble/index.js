import { connect } from 'react-redux';
import { selectUnseenNotificationCount } from 'redux/selectors/notifications';
import NotificationHeaderButton from './view';

const select = (state) => ({
  unseenCount: selectUnseenNotificationCount(state),
});

export default connect(select)(NotificationHeaderButton);
