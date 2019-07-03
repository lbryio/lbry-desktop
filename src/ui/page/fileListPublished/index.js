import { connect } from 'react-redux';
import { selectIsFetchingClaimListMine, selectMyClaimUrisWithoutChannels, doCheckPendingPublishes } from 'lbry-redux';
import FileListPublished from './view';

const select = state => ({
  uris: selectMyClaimUrisWithoutChannels(state),
  fetching: selectIsFetchingClaimListMine(state),
});

const perform = dispatch => ({
  checkPendingPublishes: () => dispatch(doCheckPendingPublishes()),
});

export default connect(
  select,
  perform
)(FileListPublished);
