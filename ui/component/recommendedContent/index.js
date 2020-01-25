import { connect } from 'react-redux';
import { makeSelectClaimForUri, doSearch, makeSelectRecommendedContentForUri, selectIsSearching } from 'lbry-redux';
import RecommendedVideos from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  recommendedContent: makeSelectRecommendedContentForUri(props.uri)(state),
  isSearching: selectIsSearching(state),
});

const perform = (dispatch, ownProps) => ({
  search: query => dispatch(doSearch(query, 20, undefined, true, { related_to: ownProps.claimId })),
});

export default connect(
  select,
  perform
)(RecommendedVideos);
