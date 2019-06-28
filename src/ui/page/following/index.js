import { connect } from 'react-redux';
import { selectFollowedTags } from 'lbry-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import TagsEdit from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
});

const perform = {};

export default connect(
  select,
  perform
)(TagsEdit);
