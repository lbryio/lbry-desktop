import { connect } from 'react-redux';
import { selectSubscriptionUris } from 'redux/selectors/subscriptions';
import ChannelsFollowingManage from './view';

const select = (state) => ({
  subscribedChannelUris: selectSubscriptionUris(state),
});

export default connect(select)(ChannelsFollowingManage);
