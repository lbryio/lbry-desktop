import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectSubscriptions, selectSuggestedChannels } from 'redux/selectors/subscriptions';
import TagsEdit from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  suggestedSubscriptions: selectSuggestedChannels(state),
});

export default connect(select)(TagsEdit);
