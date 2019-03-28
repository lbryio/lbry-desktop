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
import { navigate } from '@reach/router';
import { formatLbryUriForWeb } from 'util/uri';

const select = state => ({
  suggestions: selectSearchSuggestions(state),
  searchQuery: selectSearchValue(state),
  isFocused: selectSearchBarFocused(state),
});

const perform = dispatch => ({
  onSearch: query => {
    navigate(`/$/search?q=${query}`);
    analytics.apiLogSearch();
  },
  onSubmit: uri => {
    const path = formatLbryUriForWeb(uri);
    navigate(path);
    dispatch(doUpdateSearchQuery(''));
  },
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  doFocus: () => dispatch(doFocusSearchInput()),
  doBlur: () => dispatch(doBlurSearchInput()),
});

export default connect(
  select,
  perform
)(Wunderbar);
