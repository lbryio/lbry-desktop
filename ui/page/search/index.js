import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { doSearch } from 'redux/actions/search';
import { SIMPLE_SITE } from 'config';
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
  const showMature = selectShowMatureContent(state);
  const query = makeSelectQueryWithOptions(
    urlQuery,
    SIMPLE_SITE
      ? { nsfw: false, isBackgroundSearch: false }
      : showMature === false
      ? { nsfw: false, isBackgroundSearch: false }
      : { isBackgroundSearch: false }
  )(state);

  const uris = makeSelectSearchUris(query)(state);
  const hasReachedMaxResultsLength = makeSelectHasReachedMaxResultsLength(query)(state);

  return {
    isSearching: selectIsSearching(state),
    showNsfw: showMature,
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
