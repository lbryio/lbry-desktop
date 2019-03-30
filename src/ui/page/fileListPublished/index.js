import { connect } from 'react-redux';
import {
  selectIsFetchingClaimListMine,
  selectFileListPublishedSort,
  selectMyClaimsWithoutChannels,
} from 'lbry-redux';
import { doCheckPendingPublishes } from 'redux/actions/publish';
import FileListPublished from './view';

const select = state => ({
  claims: selectMyClaimsWithoutChannels(state),
  fetching: selectIsFetchingClaimListMine(state),
  sortBy: selectFileListPublishedSort(state),
});

const perform = dispatch => ({
  checkPendingPublishes: () => dispatch(doCheckPendingPublishes()),
});

export default connect(
  select,
  perform
)(FileListPublished);
