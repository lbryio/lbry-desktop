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
import { makeSelectClientSetting } from 'redux/selectors/settings';
import * as settings from 'constants/settings';
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
    resultCount: makeSelectClientSetting(settings.RESULT_COUNT)(state),
  };
};

const perform = dispatch => ({
  onSearch: (query, size) => {
    dispatch(doSearch(query, size));
    dispatch(doNavigate(`/search`, { query }));
  },
  onSubmit: (uri, extraParams) => dispatch(doNavigate('/show', { uri, ...extraParams })),
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  doFocus: () => dispatch(doFocusSearchInput()),
  doBlur: () => dispatch(doBlurSearchInput()),
  doShowSnackBar: (props) => dispatch(doToast(props)),
});

export default connect(
  select,
  perform
)(Wunderbar);
