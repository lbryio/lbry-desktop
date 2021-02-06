import { connect } from 'react-redux';
import {
  makeSelectIsUriResolving,
  makeSelectClaimIdForUri,
  makeSelectClaimForClaimId,
  makeSelectUrlsForCollectionId,
  makeSelectNameForCollectionId,
  makeSelectPendingCollectionForId,
  makeSelectCountForCollectionId,
} from 'lbry-redux';
import CollectionPreviewOverlay from './view';

const select = (state, props) => {
  const collectionId = props.collectionId || (props.uri && makeSelectClaimIdForUri(props.uri));
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
    isResolvingUri: collectionUri && makeSelectIsUriResolving(collectionUri)(state),
  };
};

export default connect(select)(CollectionPreviewOverlay);
