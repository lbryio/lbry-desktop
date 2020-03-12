import { connect } from 'react-redux';
import { selectFollowedTags } from 'lbry-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import UserChannelFollowIntro from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
});

const perform = dispatch => ({
  channelSubscribe: uri => dispatch(doChannelSubscribe(uri)),
});

export default connect(
  select,
  perform
)(UserChannelFollowIntro);
