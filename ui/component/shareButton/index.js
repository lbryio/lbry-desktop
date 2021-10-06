import { connect } from 'react-redux';
import { doChannelSubscribe, doChannelUnsubscribe } from 'redux/actions/subscriptions';
import { doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import ShareButton from './view';

const select = (state, props) => ({});

export default connect(select, {
  doChannelSubscribe,
  doChannelUnsubscribe,
  doOpenModal,
  doToast,
})(ShareButton);
