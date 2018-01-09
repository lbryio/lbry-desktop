import { connect } from 'react-redux';
import lbryuri from 'lbryuri';
import { selectState as selectSearch, selectWunderBarAddress } from 'redux/selectors/search';
import { doNavigate } from 'redux/actions/navigation';
import { updateSearchQuery, getSearchSuggestions } from 'redux/actions/search';
import Wunderbar from './view';

const select = state => ({
  ...selectSearch(state),
  address: selectWunderBarAddress(state),
});

const perform = dispatch => ({
  onSearch: query => dispatch(doNavigate('/search', { query })),
  onSubmit: (query, extraParams) =>
    dispatch(doNavigate('/show', { uri: lbryuri.normalize(query), ...extraParams })),
  updateSearchQuery: query => dispatch(updateSearchQuery(query)),
  getSearchSuggestions: query => dispatch(getSearchSuggestions(query)),
});

export default connect(select, perform)(Wunderbar);
