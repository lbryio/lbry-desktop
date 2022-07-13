import { connect } from 'react-redux';
import { doCollectionEdit } from 'redux/actions/collections';
import { selectIndexForUrlInCollection, selectUrlsForCollectionId } from 'redux/selectors/collections';
import CollectionButtons from './view';

const select = (state, props) => {
  const { uri, collectionId } = props;

  return {
    collectionIndex: selectIndexForUrlInCollection(state, uri, collectionId, true),
    collectionUris: selectUrlsForCollectionId(state, collectionId),
  };
};

const perform = (dispatch, ownProps) => {
  const { collectionId } = ownProps;

  return {
    editCollection: (params) => dispatch(doCollectionEdit(collectionId, params)),
  };
};

export default connect(select, perform)(CollectionButtons);
