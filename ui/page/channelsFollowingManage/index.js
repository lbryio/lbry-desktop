import { connect } from 'react-redux';
import { selectSubscriptions, selectSuggestedChannels } from 'redux/selectors/subscriptions';
import { doFetchRecommendedSubscriptions } from 'redux/actions/subscriptions';
import ChannelsFollowingManagePage from './view';

const select = state => ({
  subscribedChannels: selectSubscriptions(state),
  suggestedSubscriptions: selectSuggestedChannels(state),
});

export default connect(
  select,
  {
    doFetchRecommendedSubscriptions,
  }
)(ChannelsFollowingManagePage);
