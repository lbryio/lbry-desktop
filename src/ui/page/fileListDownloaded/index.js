import { connect } from 'react-redux';
import { makeSelectDownloadUrlsForPage, selectDownloadUrlsCount, selectIsFetchingFileList } from 'lbry-redux';
import FileListDownloaded from './view';
import { withRouter } from 'react-router';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get('page')) || 1;
  return {
    page,
    downloadedUrls: makeSelectDownloadUrlsForPage(page)(state),
    downloadedUrlsCount: selectDownloadUrlsCount(state),
    fetching: selectIsFetchingFileList(state),
  };
};

export default withRouter(
  connect(
    select,
    null
  )(FileListDownloaded)
);
