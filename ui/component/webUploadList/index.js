import { connect } from 'react-redux';
import { selectCurrentUploads, selectUploadCount } from 'lbryinc';
import WebUploadList from './view';

const select = state => ({
  currentUploads: selectCurrentUploads(state),
  uploadCount: selectUploadCount(state),
});

export default connect(
  select,
  null
)(WebUploadList);
