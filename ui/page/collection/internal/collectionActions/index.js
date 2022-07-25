import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectCollectionIsMine, selectCollectionIsEmptyForId } from 'redux/selectors/collections';
import { doOpenModal } from 'redux/actions/app';
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

const perform = {
  doOpenModal,
};

export default connect(select, perform)(CollectionActions);
