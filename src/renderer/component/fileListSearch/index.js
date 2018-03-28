import { connect } from 'react-redux';
import {
  doSearch,
  selectIsSearching,
  makeSelectSearchUris,
  selectSearchDownloadUris,
} from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import FileListSearch from './view';

const navigateToSearch = () => {
  dispatch(doNavigate('/search'));
};

const select = (state, props) => ({
  uris: makeSelectSearchUris(props.query)(state),
  downloadUris: selectSearchDownloadUris(props.query)(state),
  isSearching: selectIsSearching(state),
});

const perform = dispatch => ({
  search: search => dispatch(doSearch(search, navigateToSearch)),
});

export default connect(select, perform)(FileListSearch);
