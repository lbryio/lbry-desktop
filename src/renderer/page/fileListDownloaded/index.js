import { connect } from 'react-redux';
import {
  doFetchClaimListMine,
  doFetchFileInfosAndPublishedClaims,
  doNavigate,
  selectFileInfosDownloaded,
  selectIsFetchingFileListDownloadedOrPublished,
  selectMyClaimsWithoutChannels,
  selectIsFetchingClaimListMine,
} from 'lbry-redux';
import FileListDownloaded from './view';

const select = state => ({
  fileInfos: selectFileInfosDownloaded(state),
  isFetching: selectIsFetchingFileListDownloadedOrPublished(state),
  claims: selectMyClaimsWithoutChannels(state),
  isFetchingClaims: selectIsFetchingClaimListMine(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  fetchFileInfosDownloaded: () => dispatch(doFetchFileInfosAndPublishedClaims()),
  fetchClaims: () => dispatch(doFetchClaimListMine()),
});

export default connect(select, perform)(FileListDownloaded);
