import { connect } from 'react-redux';
import { selectIsUriResolving, selectClaimIdForUri, makeSelectClaimForClaimId } from 'redux/selectors/claims';
import {
  makeSelectUrlsForCollectionId,
  makeSelectNameForCollectionId,
  makeSelectPendingCollectionForId,
  makeSelectCountForCollectionId,
} from 'redux/selectors/collections';
import { doFetchItemsInCollection } from 'redux/actions/collections';
import CollectionPreviewOverlay from './view';

const select = (state, props) => {
  const collectionId = props.collectionId || (props.uri && selectClaimIdForUri(state, props.uri));
  const claim = props.collectionId && makeSelectClaimForClaimId(props.collectionId)(state);
  const collectionUri = props.uri || (claim && (claim.canonical_url || claim.permanent_url)) || null;

  return {
    collectionId,
    uri: collectionUri,
    collectionCount: makeSelectCountForCollectionId(collectionId)(state),
    collectionName: makeSelectNameForCollectionId(collectionId)(state),
    collectionItemUrls: makeSelectUrlsForCollectionId(collectionId)(state), // ForId || ForUri
    pendingCollection: makeSelectPendingCollectionForId(collectionId)(state),
    claim,
    isResolvingUri: collectionUri && selectIsUriResolving(state, collectionUri),
  };
};

const perform = (dispatch) => ({
  fetchCollectionItems: (claimId) => dispatch(doFetchItemsInCollection({ collectionId: claimId })), // if collection not resolved, resolve it
});

export default connect(select, perform)(CollectionPreviewOverlay);
