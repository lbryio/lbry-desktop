import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import DiscoverPage from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  email: selectUserVerifiedEmail(state),
});

const perform = {};

export default connect(select, perform)(DiscoverPage);
