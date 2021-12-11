import { connect } from 'react-redux';
import { makeSelectCollectionForId, makeSelectCollectionForIdHasClaimUrl } from 'redux/selectors/collections';
import { makeSelectClaimIsPending } from 'redux/selectors/claims';
import { doCollectionEdit } from 'redux/actions/collections';
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
