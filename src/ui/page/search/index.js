import { connect } from 'react-redux';
import { doSearch, selectIsSearching, makeSelectSearchUris, makeSelectQueryWithOptions, doToast } from 'lbry-redux';
import analytics from 'analytics';
import SearchPage from './view';

const select = state => ({
  isSearching: selectIsSearching(state),
  uris: makeSelectSearchUris(makeSelectQueryWithOptions()(state))(state),
});

const perform = dispatch => ({
  search: query => dispatch(doSearch(query)),
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

export default connect(
  select,
  perform
)(SearchPage);
