import { connect } from 'react-redux';
import {
  selectMyPublishedPlaylistCollections,
  selectMyUnpublishedCollections,
  selectMyEditedCollections,
  selectSavedCollectionIds,
  selectSavedCollections,
  selectAreBuiltinCollectionsEmpty,
  selectHasCollections,
} from 'redux/selectors/collections';
import { selectIsFetchingMyCollections } from 'redux/selectors/claims';
import { doOpenModal } from 'redux/actions/app';
import { doResolveClaimIds } from 'redux/actions/claims';
import { doFetchItemsInCollections } from 'redux/actions/collections';
import CollectionsListMine from './view';

const select = (state) => ({
  publishedCollections: selectMyPublishedPlaylistCollections(state),
  unpublishedCollections: selectMyUnpublishedCollections(state),
  editedCollections: selectMyEditedCollections(state),
  savedCollectionIds: selectSavedCollectionIds(state),
  savedCollections: selectSavedCollections(state),
  isFetchingCollections: selectIsFetchingMyCollections(state),
  areBuiltinCollectionsEmpty: selectAreBuiltinCollectionsEmpty(state),
  hasCollections: selectHasCollections(state),
});

const perform = {
  doOpenModal,
  doResolveClaimIds,
  doFetchItemsInCollections,
};

export default connect(select, perform)(CollectionsListMine);
