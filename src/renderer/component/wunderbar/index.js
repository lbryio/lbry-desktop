import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { normalizeURI } from 'lbryURI';
import {
  selectState as selectSearch,
  selectWunderBarAddress
} from 'redux/selectors/search';
import { doSearch, doUpdateSearchQuery } from 'redux/actions/search';
import { doNavigate } from 'redux/actions/navigation';
import { doOpenModal } from 'redux/actions/app';
import Wunderbar from './view';

const select = state => ({
  ...selectSearch(state),
  address: selectWunderBarAddress(state),
});

const perform = dispatch => ({
  onSearch: query => {
    dispatch(doUpdateSearchQuery(query));
    dispatch(doOpenModal(MODALS.SEARCH));
  },
  onSubmit: (uri, extraParams) =>
    dispatch(doNavigate('/show', { uri, ...extraParams })),
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
});

export default connect(select, perform)(Wunderbar);
