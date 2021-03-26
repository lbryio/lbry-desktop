import { connect } from 'react-redux';
import { doToast } from 'lbry-redux';
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
import analytics from 'analytics';
import SearchPage from './view';

const select = (state, props) => {
  const showMature = selectShowMatureContent(state);
  const urlParams = new URLSearchParams(props.location.search);
  let urlQuery = urlParams.get('q') || null;
  if (urlQuery) {
    urlQuery = urlQuery.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
  }

  const query = makeSelectQueryWithOptions(
    urlQuery,
    showMature === false ? { nsfw: false, isBackgroundSearch: false } : { isBackgroundSearch: false }
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
  onFeedbackPositive: (query) => {
    analytics.apiSearchFeedback(query, 1);
    dispatch(
      doToast({
        message: __('Thanks for the feedback! You help make the app better for everyone.'),
      })
    );
  },
  onFeedbackNegative: (query) => {
    analytics.apiSearchFeedback(query, 0);
    dispatch(
      doToast({
        message: __(
          'Thanks for the feedback. Mark has been notified and is currently walking over to his computer to work on this.'
        ),
      })
    );
  },
});

export default withRouter(connect(select, perform)(SearchPage));
