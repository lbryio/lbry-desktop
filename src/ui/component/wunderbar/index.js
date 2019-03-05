import { connect } from 'react-redux';
import {
  selectSearchState as selectSearch,
  selectWunderBarAddress,
  selectSearchSuggestions,
  doUpdateSearchQuery,
  doFocusSearchInput,
  doBlurSearchInput,
  doSearch,
  doToast,
} from 'lbry-redux';
import analytics from 'analytics';
import { doNavigate } from 'redux/actions/navigation';
import Wunderbar from './view';

const select = state => {
  const { isActive, searchQuery, ...searchState } = selectSearch(state);
  const address = selectWunderBarAddress(state);

  // if we are on the file/channel page
  // use the address in the history stack
  const wunderbarValue = isActive ? searchQuery : searchQuery || address;

  return {
    ...searchState,
    wunderbarValue,
    suggestions: selectSearchSuggestions(state),
  };
};

const perform = dispatch => ({
  onSearch: query => {
    dispatch(doSearch(query));
    dispatch(doNavigate(`/search`, { query }));
    analytics.apiLogSearch();
  },
  onSubmit: (uri, extraParams) => dispatch(doNavigate('/show', { uri, ...extraParams })),
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  doFocus: () => dispatch(doFocusSearchInput()),
  doBlur: () => dispatch(doBlurSearchInput()),
  doShowSnackBar: props => dispatch(doToast(props)),
});

export default connect(
  select,
  perform
)(Wunderbar);
