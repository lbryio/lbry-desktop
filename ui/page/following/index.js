import { connect } from 'react-redux';
import { selectFollowedTags } from 'lbry-redux';
import { selectSubscriptions, selectSuggestedChannels } from 'redux/selectors/subscriptions';
import { doFetchRecommendedSubscriptions } from 'redux/actions/subscriptions';

import TagsEdit from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  suggestedSubscriptions: selectSuggestedChannels(state),
});

export default connect(
  select,
  {
    doFetchRecommendedSubscriptions,
  }
)(TagsEdit);
