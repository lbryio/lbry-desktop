import { connect } from 'react-redux';
import { doChannelSubscribe, doChannelUnsubscribe } from 'redux/actions/subscriptions';
import {
  selectIsSubscribedForUri,
  selectFirstRunCompleted,
  makeSelectNotificationsDisabled,
} from 'redux/selectors/subscriptions';
import { selectPermanentUrlForUri } from 'redux/selectors/claims';
import { selectUser } from 'redux/selectors/user';
import { doToast } from 'redux/actions/notifications';
import SubscribeButton from './view';

const select = (state, props) => ({
  isSubscribed: selectIsSubscribedForUri(state, props.uri),
  firstRunCompleted: selectFirstRunCompleted(state),
  permanentUrl: selectPermanentUrlForUri(state, props.uri),
  notificationsDisabled: makeSelectNotificationsDisabled(props.uri)(state),
  user: selectUser(state),
});

export default connect(select, {
  doChannelSubscribe,
  doChannelUnsubscribe,
  doToast,
})(SubscribeButton);
