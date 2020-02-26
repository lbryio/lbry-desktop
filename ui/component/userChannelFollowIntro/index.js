import { connect } from 'react-redux';
import { selectFollowedTags } from 'lbry-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import UserChannelFollowIntro from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
});

export default connect(select)(UserChannelFollowIntro);
