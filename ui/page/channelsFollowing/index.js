import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import ChannelsFollowingPage from './view';

const select = state => ({
  subscribedChannels: selectSubscriptions(state),
});

export default connect(select)(ChannelsFollowingPage);
