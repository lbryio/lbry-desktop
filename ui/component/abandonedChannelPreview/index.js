import { connect } from 'react-redux';
import { doChannelUnsubscribe } from 'redux/actions/subscriptions';
import AbandonedChannelPreview from './view';

export default connect(
  null,
  {
    doChannelUnsubscribe,
  }
)(AbandonedChannelPreview);
