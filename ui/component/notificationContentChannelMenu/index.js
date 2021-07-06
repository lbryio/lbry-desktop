import { connect } from 'react-redux';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import { doToast } from 'redux/actions/notifications';
import { makeSelectNotificationsDisabled } from 'redux/selectors/subscriptions';
import NotificationContentChannelMenu from './view';

const select = (state, props) => ({
  notificationsDisabled: makeSelectNotificationsDisabled(props.uri)(state),
});

export default connect(select, {
  doChannelSubscribe,
  doToast,
})(NotificationContentChannelMenu);
