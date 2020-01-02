import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'lbryinc';
import { selectSubscriptions, selectSuggestedChannels } from 'redux/selectors/subscriptions';
import { doFetchRecommendedSubscriptions } from 'redux/actions/subscriptions';
import DiscoverPage from './view';

const select = state => ({
  subscribedChannels: selectSubscriptions(state),
  email: selectUserVerifiedEmail(state),
  suggestedSubscriptions: selectSuggestedChannels(state),
});

const perform = {
  doFetchRecommendedSubscriptions,
};

export default connect(
  select,
  perform
)(DiscoverPage);
