import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { doSearch } from 'redux/actions/search';
import {
  selectIsSearching,
  makeSelectSearchUris,
  makeSelectQueryWithOptions,
  selectSearchOptions,
  makeSelectHasReachedMaxResultsLength,
} from 'redux/selectors/search';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import SearchPage from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  let urlQuery = urlParams.get('q') || null;
  if (urlQuery) {
    urlQuery = urlQuery.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
  }
  const query = makeSelectQueryWithOptions(urlQuery, { nsfw: false, isBackgroundSearch: false })(state);
  const uris = makeSelectSearchUris(query)(state);
  const hasReachedMaxResultsLength = makeSelectHasReachedMaxResultsLength(query)(state);

  return {
    isSearching: selectIsSearching(state),
    showNsfw: selectShowMatureContent(state),
    uris: uris,
    isAuthenticated: selectUserVerifiedEmail(state),
    searchOptions: selectSearchOptions(state),
    hasReachedMaxResultsLength: hasReachedMaxResultsLength,
  };
};

const perform = (dispatch) => ({
  search: (query, options) => dispatch(doSearch(query, options)),
});

export default withRouter(connect(select, perform)(SearchPage));
