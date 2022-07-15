import { connect } from 'react-redux';
import { makeSelectClaimIsPending } from 'redux/selectors/claims';
import { selectCollectionHasEditsForId, selectCollectionLengthForId } from 'redux/selectors/collections';
import CollectionPublishButton from './view';

const select = (state, props) => {
  const { uri, collectionId } = props;

  return {
    claimIsPending: makeSelectClaimIsPending(uri)(state),
    collectionHasEdits: selectCollectionHasEditsForId(state, collectionId),
    collectionLength: selectCollectionLengthForId(state, collectionId),
  };
};

export default connect(select)(CollectionPublishButton);
