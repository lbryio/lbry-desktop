import { connect } from 'react-redux';
import { selectClaimIsPendingForId } from 'redux/selectors/claims';
import { selectCollectionHasEditsForId, selectCollectionLengthForId } from 'redux/selectors/collections';
import CollectionPublishButton from './view';

const select = (state, props) => {
  const { collectionId } = props;

  return {
    claimIsPending: selectClaimIsPendingForId(state, collectionId),
    collectionHasEdits: selectCollectionHasEditsForId(state, collectionId),
    collectionLength: selectCollectionLengthForId(state, collectionId),
  };
};

export default connect(select)(CollectionPublishButton);
