import { connect } from 'react-redux';
import { selectIsFetchingClaimListMine, selectMyClaimUrisWithoutChannels } from 'lbry-redux';
import { doCheckPendingPublishes } from 'redux/actions/publish';
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
