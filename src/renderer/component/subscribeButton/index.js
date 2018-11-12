import { connect } from 'react-redux';
import { doChannelSubscribe, doChannelUnsubscribe } from 'redux/actions/subscriptions';
import { doNotify } from 'lbry-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import SubscribeButton from './view';

const select = (state, props) => ({
  subscriptions: selectSubscriptions(state),
});

export default connect(select, {
  doChannelSubscribe,
  doChannelUnsubscribe,
  doNotify,
})(SubscribeButton);
