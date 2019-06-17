import { connect } from 'react-redux';
import { doClaimSearch, selectLastClaimSearchUris, selectFetchingClaimSearch, doToggleTagFollow } from 'lbry-redux';
import FileListDiscover from './view';

const select = state => ({
  uris: selectLastClaimSearchUris(state),
  loading: selectFetchingClaimSearch(state),
});

const perform = {
  doClaimSearch,
  doToggleTagFollow,
};

export default connect(
  select,
  perform
)(FileListDiscover);
