import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { doSearch } from 'redux/actions/search';
import {
  selectIsSearching,
  makeSelectSearchUris,
  selectSearchOptions,
  makeSelectHasReachedMaxResultsLength,
} from 'redux/selectors/search';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { getSearchQueryString } from 'util/query-params';
import SearchPage from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);

  let urlQuery = urlParams.get('q') || null;
  if (urlQuery) {
    urlQuery = urlQuery.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
  }

  const searchOptions = {
    ...selectSearchOptions(state),
    isBackgroundSearch: false,
    nsfw: showMature,
  };

  const query = getSearchQueryString(urlQuery, searchOptions);
  const uris = makeSelectSearchUris(query)(state);
  const hasReachedMaxResultsLength = makeSelectHasReachedMaxResultsLength(query)(state);

  return {
    urlQuery,
    searchOptions,
    isSearching: selectIsSearching(state),
    uris: uris,
    isAuthenticated: selectUserVerifiedEmail(state),
    hasReachedMaxResultsLength: hasReachedMaxResultsLength,
  };
};

const perform = (dispatch) => ({
  search: (query, options) => dispatch(doSearch(query, options)),
});

export default withRouter(connect(select, perform)(SearchPage));
