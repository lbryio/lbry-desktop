import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectClaimIsNsfw,
  doSearch,
  makeSelectRecommendedContentForUri,
  selectIsSearching,
} from 'lbry-redux';
import RecommendedVideos from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  mature: makeSelectClaimIsNsfw(props.uri)(state),
  recommendedContent: makeSelectRecommendedContentForUri(props.uri)(state),
  isSearching: selectIsSearching(state),
});

const perform = dispatch => ({
  search: (query, options) => dispatch(doSearch(query, options)),
});

export default connect(
  select,
  perform
)(RecommendedVideos);
