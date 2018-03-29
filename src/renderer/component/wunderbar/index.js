import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { normalizeURI } from 'lbryURI';
import { selectState as selectSearch, selectWunderBarAddress } from 'redux/selectors/search';
import { doUpdateSearchQuery } from 'redux/actions/search';
import { doNavigate } from 'redux/actions/navigation';
import { doOpenModal } from 'redux/actions/app';
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
    dispatch(doUpdateSearchQuery(query));
    dispatch(doOpenModal(MODALS.SEARCH));
  },
  onSubmit: (uri, extraParams) => dispatch(doNavigate('/show', { uri, ...extraParams })),
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
});

export default connect(select, perform)(Wunderbar);
