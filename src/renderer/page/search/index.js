import { connect } from 'react-redux';
import { selectIsSearching, selectSearchQuery } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import SearchPage from './view';

const select = state => ({
  isSearching: selectIsSearching(state),
  query: selectSearchQuery(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(SearchPage);
