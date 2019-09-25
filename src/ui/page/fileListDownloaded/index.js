import { connect } from 'react-redux';
import { makeSelectDownloadUrisForPage, selectDownloadUrisCount, selectIsFetchingFileList } from 'lbry-redux';
import FileListDownloaded from './view';
import { withRouter } from 'react-router';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get('page')) || 1;
  return {
    page,
    downloadedUris: makeSelectDownloadUrisForPage(page)(state),
    downloadedUrisCount: selectDownloadUrisCount(state),
    fetching: selectIsFetchingFileList(state),
  };
};

export default withRouter(
  connect(
    select,
    null
  )(FileListDownloaded)
);
