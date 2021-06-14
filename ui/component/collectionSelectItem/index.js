import { connect } from 'react-redux';
import {
  doCollectionEdit,
  makeSelectCollectionForId,
  makeSelectClaimIsPending,
  makeSelectCollectionForIdHasClaimUrl,
} from 'lbry-redux';
import CollectionSelectItem from './view';

const select = (state, props) => {
  return {
    collection: makeSelectCollectionForId(props.collectionId)(state),
    hasClaim: makeSelectCollectionForIdHasClaimUrl(props.collectionId, props.uri)(state),
    collectionPending: makeSelectClaimIsPending(props.collectionId)(state),
  };
};

const perform = (dispatch) => ({
  editCollection: (id, params) => dispatch(doCollectionEdit(id, params)),
});

export default connect(select, perform)(CollectionSelectItem);
