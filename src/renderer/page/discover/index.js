import { connect } from 'react-redux';
import { selectFeaturedUris, selectFetchingFeaturedUris, doFetchFeaturedUris } from 'lbry-redux';
import { doFetchRewardedContent } from 'lbryinc';
import DiscoverPage from './view';

const select = state => ({
  featuredUris: selectFeaturedUris(state),
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
});

const perform = dispatch => ({
  fetchFeaturedUris: () => dispatch(doFetchFeaturedUris()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
});

export default connect(
  select,
  perform
)(DiscoverPage);
