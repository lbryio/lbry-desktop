import { connect } from 'react-redux';
import {
  selectSearchState as selectSearch,
  selectWunderBarAddress,
  doUpdateSearchQuery,
  doNotify,
  MODALS,
  doFocusSearchInput,
  doBlurSearchInput,
  doSearch,
} from 'lbry-redux';
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
  };
};

const perform = dispatch => ({
  onSearch: query => {
    dispatch(doSearch(query));
    dispatch(doNavigate(`/search`, { query }));
  },
  onSubmit: (uri, extraParams) => dispatch(doNavigate('/show', { uri, ...extraParams })),
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  doFocus: () => dispatch(doFocusSearchInput()),
  doBlur: () => dispatch(doBlurSearchInput()),
});

export default connect(select, perform)(Wunderbar);
