import { connect } from 'react-redux';
import { doToast, SETTINGS } from 'lbry-redux';
import { withRouter } from 'react-router';
import { doSearch } from 'redux/actions/search';
import {
  selectIsSearching,
  makeSelectSearchUris,
  makeSelectQueryWithOptions,
  selectSearchOptions,
} from 'redux/selectors/search';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import analytics from 'analytics';
import SearchPage from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const urlQuery = urlParams.get('q') || null;
  const query = makeSelectQueryWithOptions(urlQuery, { nsfw: false, isBackgroundSearch: false })(state);
  const uris = makeSelectSearchUris(query)(state);

  return {
    isSearching: selectIsSearching(state),
    showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
    uris: uris,
    isAuthenticated: selectUserVerifiedEmail(state),
    searchOptions: selectSearchOptions(state),
  };
};

const perform = dispatch => ({
  search: (query, options) => dispatch(doSearch(query, options)),
  onFeedbackPositive: query => {
    analytics.apiSearchFeedback(query, 1);
    dispatch(
      doToast({
        message: __('Thanks for the feedback! You help make the app better for everyone.'),
      })
    );
  },
  onFeedbackNegative: query => {
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
