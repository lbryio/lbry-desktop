import { connect } from 'react-redux';
import {
  doFocusSearchInput,
  doBlurSearchInput,
  doUpdateSearchQuery,
  doToast,
  selectSearchValue,
  selectSearchSuggestions,
  selectSearchBarFocused,
} from 'lbry-redux';
import analytics from 'analytics';
import Wunderbar from './view';
import { withRouter } from 'react-router-dom';
import { formatLbryUriForWeb } from 'util/uri';

const select = state => ({
  suggestions: selectSearchSuggestions(state),
  searchQuery: selectSearchValue(state),
  isFocused: selectSearchBarFocused(state),
});

const perform = (dispatch, ownProps) => ({
  onSearch: query => {
    ownProps.history.push({ pathname: `/$/search`, search: `?q=${encodeURIComponent(query)}` });
    dispatch(doUpdateSearchQuery(query));
    analytics.apiLogSearch();
  },
  onSubmit: uri => {
    const path = formatLbryUriForWeb(uri);
    ownProps.history.push(path);
    dispatch(doUpdateSearchQuery(''));
  },
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  doShowSnackBar: message => dispatch(doToast({ isError: true, message })),
  doFocus: () => dispatch(doFocusSearchInput()),
  doBlur: () => dispatch(doBlurSearchInput()),
});

export default withRouter(
  connect(
    select,
    perform
  )(Wunderbar)
);
