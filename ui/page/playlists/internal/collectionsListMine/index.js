import { connect } from 'react-redux';
import {
  selectMyPublishedPlaylistCollections,
  selectMyUnpublishedCollections,
  selectAreBuiltinCollectionsEmpty,
  selectHasCollections,
} from 'redux/selectors/collections';
import { selectIsFetchingMyCollections } from 'redux/selectors/claims';
import { doOpenModal } from 'redux/actions/app';
import CollectionsListMine from './view';

const select = (state) => ({
  publishedCollections: selectMyPublishedPlaylistCollections(state),
  unpublishedCollections: selectMyUnpublishedCollections(state),
  isFetchingCollections: selectIsFetchingMyCollections(state),
  areBuiltinCollectionsEmpty: selectAreBuiltinCollectionsEmpty(state),
  hasCollections: selectHasCollections(state),
});

const perform = {
  doOpenModal,
};

export default connect(select, perform)(CollectionsListMine);
