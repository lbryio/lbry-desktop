import { connect } from 'react-redux';
import {
  makeSelectSearchDownloadUrlsForPage,
  selectDownloadUrlsCount,
  selectIsFetchingFileList,
} from 'redux/selectors/file_info';
import {
  makeSelectMyPurchasesForPage,
  selectIsFetchingMyPurchases,
  selectMyPurchasesCount,
} from 'redux/selectors/claims';
import FileListDownloaded from './view';
import { withRouter } from 'react-router';

const select = (state, props) => {
  const { history, location } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const query = urlParams.get('query') || '';
  const page = Number(urlParams.get('page')) || 1;
  return {
    page,
    history,
    query,
    downloadedUrlsCount: selectDownloadUrlsCount(state),
    myPurchasesCount: selectMyPurchasesCount(state),
    myPurchases: makeSelectMyPurchasesForPage(query, page)(state),
    myDownloads: makeSelectSearchDownloadUrlsForPage(query, page)(state),
    fetchingFileList: selectIsFetchingFileList(state),
    fetchingMyPurchases: selectIsFetchingMyPurchases(state),
  };
};

export default withRouter(connect(select)(FileListDownloaded));
