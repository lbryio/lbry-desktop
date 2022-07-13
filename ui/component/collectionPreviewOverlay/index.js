import { connect } from 'react-redux';
import { selectThumbnailForId } from 'redux/selectors/claims';
import { selectUrlsForCollectionId } from 'redux/selectors/collections';
import { doFetchItemsInCollection } from 'redux/actions/collections';
import CollectionPreviewOverlay from './view';

const select = (state, props) => {
  const { collectionId } = props;

  return {
    collectionId,
    collectionItemUrls: selectUrlsForCollectionId(state, collectionId),
    collectionThumbnail: selectThumbnailForId(state, collectionId),
  };
};

const perform = {
  doFetchItemsInCollection,
};

export default connect(select, perform)(CollectionPreviewOverlay);
