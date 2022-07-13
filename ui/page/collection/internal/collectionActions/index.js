import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectCollectionIsMine, selectCollectionIsEmptyForId } from 'redux/selectors/collections';
import CollectionActions from './view';

const select = (state, props) => {
  const { uri, collectionId } = props;

  const { claim_id: claimId } = selectClaimForUri(state, uri) || {};

  return {
    claimId,
    isMyCollection: selectCollectionIsMine(state, collectionId),
    collectionEmpty: selectCollectionIsEmptyForId(state, collectionId),
  };
};

export default connect(select)(CollectionActions);
