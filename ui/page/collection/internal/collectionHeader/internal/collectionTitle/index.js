import { connect } from 'react-redux';

import { selectCollectionNameForId, selectCollectionHasEditsForId } from 'redux/selectors/collections';

import CollectionHeader from './view';

const select = (state, props) => {
  const { collectionId } = props;

  return {
    collectionName: selectCollectionNameForId(state, collectionId),
    collectionHasEdits: selectCollectionHasEditsForId(state, collectionId),
  };
};

export default connect(select)(CollectionHeader);
