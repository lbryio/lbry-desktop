import { connect } from 'react-redux';
import { doChannelSubscribe, doChannelUnsubscribe } from 'redux/actions/subscriptions';
import {
  selectIsSubscribedForUri,
  selectFirstRunCompleted,
  makeSelectNotificationsDisabled,
} from 'redux/selectors/subscriptions';
import { makeSelectPermanentUrlForUri } from 'redux/selectors/claims';
import { selectUser } from 'redux/selectors/user';
import { doToast } from 'redux/actions/notifications';
import SubscribeButton from './view';

const select = (state, props) => ({
  isSubscribed: selectIsSubscribedForUri(state, props.uri),
  firstRunCompleted: selectFirstRunCompleted(state),
  permanentUrl: makeSelectPermanentUrlForUri(props.uri)(state),
  notificationsDisabled: makeSelectNotificationsDisabled(props.uri)(state),
  user: selectUser(state),
});

export default connect(select, {
  doChannelSubscribe,
  doChannelUnsubscribe,
  doToast,
})(SubscribeButton);
