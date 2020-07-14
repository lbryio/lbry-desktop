import { connect } from 'react-redux';
import { selectBlockedChannels } from 'lbry-redux';
import { doChannelUnsubscribe } from 'redux/actions/subscriptions';
import { doOpenModal } from 'redux/actions/app';
import AbandonedChannelPreview from './view';

const select = (state, props) => ({
  blockedChannelUris: selectBlockedChannels(state),
});

export default connect(select, {
  doChannelUnsubscribe,
  doOpenModal,
})(AbandonedChannelPreview);
