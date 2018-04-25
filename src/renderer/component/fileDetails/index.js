import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
  makeSelectFileInfoForUri,
} from 'lbry-redux';
import { doOpenFileInFolder } from 'redux/actions/file';
import FileDetails from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  openFolder: path => dispatch(doOpenFileInFolder(path)),
});

export default connect(select, perform)(FileDetails);
