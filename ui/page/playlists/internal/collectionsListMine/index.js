import { connect } from 'react-redux';
import {
  selectMyPublishedCollections,
  selectMyUnpublishedCollections,
  selectMyEditedCollections,
  selectMyUpdatedCollections,
  selectSavedCollectionIds,
  selectSavedCollections,
  selectAreBuiltinCollectionsEmpty,
  selectHasCollections,
  selectFeaturedChannelsIds,
} from 'redux/selectors/collections';
import { selectIsFetchingMyCollections } from 'redux/selectors/claims';
import { doOpenModal } from 'redux/actions/app';
import { doFetchItemsInCollections } from 'redux/actions/collections';
import CollectionsListMine from './view';

const select = (state) => ({
  publishedCollections: selectMyPublishedCollections(state),
  unpublishedCollections: selectMyUnpublishedCollections(state),
  editedCollections: selectMyEditedCollections(state),
  updatedCollections: selectMyUpdatedCollections(state),
  savedCollectionIds: selectSavedCollectionIds(state),
  savedCollections: selectSavedCollections(state),
  featuredChannelsIds: selectFeaturedChannelsIds(state),
  isFetchingCollections: selectIsFetchingMyCollections(state),
  areBuiltinCollectionsEmpty: selectAreBuiltinCollectionsEmpty(state),
  hasCollections: selectHasCollections(state),
});

const perform = {
  doOpenModal,
  doFetchItemsInCollections,
};

export default connect(select, perform)(CollectionsListMine);
