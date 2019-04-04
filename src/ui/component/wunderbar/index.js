import { connect } from 'react-redux';
import {
  doFocusSearchInput,
  doBlurSearchInput,
  doUpdateSearchQuery,
  doSearch,
  selectSearchValue,
  selectSearchSuggestions,
  selectSearchBarFocused,
  parseURI,
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
    ownProps.history.push({ pathname: `/$/search`, search: `?q=${query}` });
    analytics.apiLogSearch();
  },
  onSubmit: uri => {
    const path = formatLbryUriForWeb(uri);
    ownProps.history.push(path);
    dispatch(doUpdateSearchQuery(''));
  },
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  doFocus: () => dispatch(doFocusSearchInput()),
  doBlur: () => dispatch(doBlurSearchInput()),
});

export default withRouter(
  connect(
    select,
    perform
  )(Wunderbar)
);
