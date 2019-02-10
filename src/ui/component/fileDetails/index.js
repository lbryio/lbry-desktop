import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
  makeSelectFileInfoForUri,
  doToast,
} from 'lbry-redux';
import { selectUser } from 'lbryinc';
import { doOpenFileInFolder } from 'redux/actions/file';
import { selectHasClickedComment } from 'redux/selectors/app';
import { doClickCommentButton } from 'redux/actions/app';
import FileDetails from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  hasClickedComment: selectHasClickedComment(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  openFolder: path => dispatch(doOpenFileInFolder(path)),
  showSnackBar: message => dispatch(doToast({ message })),
  clickCommentButton: () => dispatch(doClickCommentButton()),
});

export default connect(
  select,
  perform
)(FileDetails);
