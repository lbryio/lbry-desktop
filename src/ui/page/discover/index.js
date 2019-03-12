import { connect } from 'react-redux';
import {
  doFetchRewardedContent,
  doRewardList,
  selectFeaturedUris,
  doFetchFeaturedUris,
  selectFetchingFeaturedUris,
} from 'lbryinc';
import DiscoverPage from './view';

const select = state => ({
  featuredUris: selectFeaturedUris(state),
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
});

const perform = dispatch => ({
  fetchFeaturedUris: () => dispatch(doFetchFeaturedUris(true)),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  fetchRewards: () => dispatch(doRewardList()),
});

export default connect(
  select,
  perform
)(DiscoverPage);
