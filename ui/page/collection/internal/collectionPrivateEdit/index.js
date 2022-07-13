import { connect } from 'react-redux';
import { doClearEditsForCollectionid, doCollectionEdit } from 'redux/actions/collections';
import { doOpenModal } from 'redux/actions/app';
import {
  selectCollectionForId,
  selectUrlsForCollectionId,
  selectCollectionHasEditsForId,
} from 'redux/selectors/collections';

import CollectionForm from './view';

const select = (state, props) => {
  const { collectionId } = props;

  return {
    collection: selectCollectionForId(state, collectionId),
    collectionUrls: selectUrlsForCollectionId(state, collectionId),
    collectionHasEdits: selectCollectionHasEditsForId(state, collectionId),
  };
};

const perform = {
  doCollectionEdit,
  doClearEditsForCollectionid,
  doOpenModal,
};

export default connect(select, perform)(CollectionForm);
