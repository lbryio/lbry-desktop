import { connect } from 'react-redux';
import {
  selectFileInfosDownloaded,
  selectMyClaimsWithoutChannels,
  selectIsFetchingFileList,
  selectFileListDownloadedSort,
} from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import FileListDownloaded from './view';

const select = state => ({
  fileInfos: selectFileInfosDownloaded(state),
  fetching: selectIsFetchingFileList(state),
  claims: selectMyClaimsWithoutChannels(state),
  sortBy: selectFileListDownloadedSort(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(
  select,
  perform
)(FileListDownloaded);
