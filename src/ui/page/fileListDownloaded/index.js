import { connect } from 'react-redux';
import {
  selectFileInfosDownloaded,
  selectMyClaimsWithoutChannels,
  selectIsFetchingFileList,
  selectFileListDownloadedSort,
} from 'lbry-redux';
import FileListDownloaded from './view';

const select = state => ({
  fileInfos: selectFileInfosDownloaded(state),
  fetching: selectIsFetchingFileList(state),
  claims: selectMyClaimsWithoutChannels(state),
  sortBy: selectFileListDownloadedSort(state),
});

export default connect(
  select,
  null
)(FileListDownloaded);
