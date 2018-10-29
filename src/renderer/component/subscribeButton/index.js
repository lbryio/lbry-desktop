import { connect } from 'react-redux';
import { doChannelSubscribe, doChannelUnsubscribe } from 'redux/actions/subscriptions';
import { doOpenModal } from 'redux/actions/app';
import { selectSubscriptions, makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import SubscribeButton from './view';

const select = (state, props) => ({
  subscriptions: selectSubscriptions(state),
  isSubscribed: makeSelectIsSubscribed(props.uri, true)(state),
});

export default connect(
  select,
  {
    doChannelSubscribe,
    doChannelUnsubscribe,
    doOpenModal,
  }
)(SubscribeButton);
