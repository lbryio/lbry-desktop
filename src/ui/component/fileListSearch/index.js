import { connect } from 'react-redux';
import {
  makeSelectSearchUris,
  selectIsSearching,
  selectSearchDownloadUris,
  makeSelectQueryWithOptions,
} from 'lbry-redux';
import FileListSearch from './view';

const select = (state, props) => ({
  uris: makeSelectSearchUris(makeSelectQueryWithOptions()(state))(state),
  downloadUris: selectSearchDownloadUris(props.query)(state),
  isSearching: selectIsSearching(state),
});

export default connect(select)(FileListSearch);
