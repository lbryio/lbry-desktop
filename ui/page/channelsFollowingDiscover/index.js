import { connect } from 'react-redux';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import { selectFollowedTags } from 'lbry-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import ChannelsFollowingManagePage from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  blockedChannels: selectBlockedChannels(state),
});

export default connect(select)(ChannelsFollowingManagePage);
