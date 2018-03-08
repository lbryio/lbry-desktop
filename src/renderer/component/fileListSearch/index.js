import { connect } from 'react-redux';
import { doSearch } from 'redux/actions/search';
import { makeSelectSearchUris } from 'redux/selectors/search';
import { selectSearchDownloadUris } from 'redux/selectors/file_info';
import FileListSearch from './view';

const select = (state, props) => ({
  uris: makeSelectSearchUris(props.query)(state),
  downloadUris: selectSearchDownloadUris(props.query)(state)
});

const perform = dispatch => ({
  search: search => dispatch(doSearch(search)),
});

export default connect(select, perform)(FileListSearch);
