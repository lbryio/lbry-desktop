import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSearch, selectIsSearching, makeSelectSearchUris, makeSelectQueryWithOptions, doToast } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import analytics from 'analytics';
import SearchPage from './view';

const select = state => {
  const showMature = makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state);
  const query = makeSelectQueryWithOptions(
    null,
    showMature === false ? { nsfw: false, isBackgroundSearch: false } : { isBackgroundSearch: false }
  )(state);
  const uris = makeSelectSearchUris(query)(state);

  return {
    isSearching: selectIsSearching(state),
    showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
    uris: uris,
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

export default connect(
  select,
  perform
)(SearchPage);
