import { connect } from 'react-redux';
import { doSearch, selectIsSearching, makeSelectSearchUris } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import FileListSearch from './view';

const navigateToSearch = () => {
  dispatch(doNavigate('/search'));
};

const select = (state, props) => ({
  isSearching: selectIsSearching(state),
  uris: makeSelectSearchUris(props.query)(state),
});

const perform = dispatch => ({
  search: search => dispatch(doSearch(search, navigateToSearch)),
});

export default connect(select, perform)(FileListSearch);
