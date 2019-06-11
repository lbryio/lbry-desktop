import { connect } from 'react-redux';
import { selectDownloadedUris, selectIsFetchingFileList } from 'lbry-redux';
import FileListDownloaded from './view';

const select = state => ({
  downloadedUris: selectDownloadedUris(state),
  fetching: selectIsFetchingFileList(state),
});

export default connect(
  select,
  null
)(FileListDownloaded);
