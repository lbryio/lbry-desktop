import { connect } from 'react-redux';
import {
  selectDownloadUrlsCount,
  selectIsFetchingFileList,
  selectMyPurchases,
  selectIsFetchingMyPurchases,
  doPurchaseList,
  selectBuiltinCollections,
  selectMyPublishedMixedCollections,
  selectMyPublishedPlaylistCollections,
  selectMyUnpublishedCollections, // should probably distinguish types
  // selectSavedCollections, // TODO: implement saving and copying collections
} from 'lbry-redux';

import ListsPage from './view';

const select = (state) => ({
  allDownloadedUrlsCount: selectDownloadUrlsCount(state),
  fetchingFileList: selectIsFetchingFileList(state),
  myPurchases: selectMyPurchases(state),
  fetchingMyPurchases: selectIsFetchingMyPurchases(state),
  builtinCollections: selectBuiltinCollections(state),
  publishedCollections: selectMyPublishedMixedCollections(state),
  publishedPlaylists: selectMyPublishedPlaylistCollections(state),
  unpublishedCollections: selectMyUnpublishedCollections(state),
  // savedCollections: selectSavedCollections(state),
});

export default connect(select, {
  doPurchaseList,
})(ListsPage);
