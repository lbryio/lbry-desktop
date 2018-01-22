import { connect } from 'react-redux';
import { doNavigate, selectIsSearching, selectSearchQuery } from 'lbry-redux';
import SearchPage from './view';

const select = state => ({
  isSearching: selectIsSearching(state),
  query: selectSearchQuery(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(SearchPage);
