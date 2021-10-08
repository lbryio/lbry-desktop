import { connect } from 'react-redux';
import { selectDownloadUrlsCount, selectIsFetchingFileList } from 'redux/selectors/file_info';
import { selectMyPurchases, selectIsFetchingMyPurchases } from 'redux/selectors/claims';
import { doPurchaseList } from 'redux/actions/claims';
import LibraryPage from './view';

const select = (state) => ({
  allDownloadedUrlsCount: selectDownloadUrlsCount(state),
  fetchingFileList: selectIsFetchingFileList(state),
  myPurchases: selectMyPurchases(state),
  fetchingMyPurchases: selectIsFetchingMyPurchases(state),
});

export default connect(select, {
  doPurchaseList,
})(LibraryPage);
