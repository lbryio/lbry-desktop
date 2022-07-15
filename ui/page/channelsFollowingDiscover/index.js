import { connect } from 'react-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectHomepageData, selectHomepageDiscover } from 'redux/selectors/settings';
import ChannelsFollowingDiscover from './view';

const select = (state) => ({
  subscribedChannels: selectSubscriptions(state),
  homepageData: selectHomepageData(state),
  discoverData: selectHomepageDiscover(state),
});

export default connect(select)(ChannelsFollowingDiscover);
