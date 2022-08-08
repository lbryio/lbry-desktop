import Section from './view';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doClearEditsForCollectionId } from 'redux/actions/collections';
import { selectClaimIsPendingForId } from 'redux/selectors/claims';
import {
  selectCollectionForId,
  selectCollectionHasEditsForId,
  selectCollectionIsMine,
  selectIsCollectionPrivateForId,
} from 'redux/selectors/collections';

const select = (state, props) => {
  return {
    collection: selectCollectionForId(state, props.collectionId),
    isUnpublished: selectIsCollectionPrivateForId(state, props.collectionId),
    isCollectionMine: selectCollectionIsMine(state, props.collectionId),
    hasEdits: selectCollectionHasEditsForId(state, props.collectionId),
    claimIsPending: selectClaimIsPendingForId(state, props.collectionId),
  };
};

const perform = {
  doClearEditsForCollectionId,
  doOpenModal,
};

export default connect(select, perform)(Section);
