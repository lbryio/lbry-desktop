import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimIsNsfw } from 'lbry-redux';
import { doSearch } from 'redux/actions/search';
import { makeSelectRecommendedContentForUri, selectIsSearching } from 'redux/selectors/search';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import RecommendedVideos from './view';
import { selectTheme } from 'redux/selectors/settings';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  mature: makeSelectClaimIsNsfw(props.uri)(state),
  recommendedContent: makeSelectRecommendedContentForUri(props.uri)(state),
  isSearching: selectIsSearching(state),
  theme: selectTheme(state),
  isAuthenticated: selectUserVerifiedEmail(state),
});

const perform = dispatch => ({
  search: (query, options) => dispatch(doSearch(query, options)),
});

export default connect(select, perform)(RecommendedVideos);
