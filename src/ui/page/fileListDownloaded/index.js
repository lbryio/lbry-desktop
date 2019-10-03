import { connect } from 'react-redux';
import { makeSelectSearchDownloadUrlsForPage, makeSelectSearchDownloadUrlsCount, selectDownloadUrlsCount, selectIsFetchingFileList } from 'lbry-redux';
import FileListDownloaded from './view';
import { withRouter } from 'react-router';

const select = (state, props) => {
  const { history, location }  = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const query = urlParams.get('query') || '';
  const page = Number(urlParams.get('page')) || 1;
  return {
    page,
    history,
    query,
    allDownloadedUrlsCount: selectDownloadUrlsCount(state),
    downloadedUrls: makeSelectSearchDownloadUrlsForPage(query, page)(state),
    downloadedUrlsCount: makeSelectSearchDownloadUrlsCount(query)(state),
    fetching: selectIsFetchingFileList(state),
  };
};

export default withRouter(
  connect(
    select,
    null
  )(FileListDownloaded)
);
