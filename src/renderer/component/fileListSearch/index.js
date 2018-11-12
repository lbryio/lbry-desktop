import { connect } from 'react-redux';
import { makeSelectSearchUris, selectIsSearching, selectSearchDownloadUris } from 'lbry-redux';
import FileListSearch from './view';

const select = (state, props) => ({
  uris: makeSelectSearchUris(props.query)(state),
  downloadUris: selectSearchDownloadUris(props.query)(state),
  isSearching: selectIsSearching(state),
});

const perform = () => ({});

export default connect(
  select,
  perform
)(FileListSearch);
