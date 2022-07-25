import { connect } from 'react-redux';

import { selectClaimForId } from 'redux/selectors/claims';
import {
  selectCollectionDescriptionForId,
  selectCountForCollectionId,
  selectCollectionHasEditsForId,
  selectMyPublishedCollectionCountForId,
} from 'redux/selectors/collections';

import CollectionHeader from './view';

const select = (state, props) => {
  const { collectionId } = props;

  const claim = collectionId && selectClaimForId(state, collectionId);
  const uri = (claim && (claim.canonical_url || claim.permanent_url)) || null;

  return {
    uri,
    collectionDescription: selectCollectionDescriptionForId(state, collectionId),
    collectionCount: selectCountForCollectionId(state, collectionId),
    publishedCollectionCount: selectMyPublishedCollectionCountForId(state, collectionId),
    collectionHasEdits: selectCollectionHasEditsForId(state, collectionId),
  };
};

export default connect(select)(CollectionHeader);
