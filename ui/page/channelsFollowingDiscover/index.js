import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectHomepageData } from 'redux/selectors/settings';
import ChannelsFollowingManagePage from './view';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  blockedChannels: [],
  homepageData: selectHomepageData(state),
});

export default connect(select)(ChannelsFollowingManagePage);
