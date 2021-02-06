import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import CollectionPage from './view';
import {
  doFetchItemsInCollection,
  makeSelectCollectionForId,
  makeSelectUrlsForCollectionId,
  makeSelectIsResolvingCollectionForId,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectClaimIsMine,
  makeSelectClaimIsPending,
  makeSelectClaimForClaimId,
  makeSelectCollectionIsMine,
  doLocalCollectionDelete,
  doCollectionEdit,
  makeSelectChannelForClaimUri,
  makeSelectCountForCollectionId,
  makeSelectEditedCollectionForId,
} from 'lbry-redux';
import { selectUser } from 'redux/selectors/user';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { collectionId } = params;

  const claim = collectionId && makeSelectClaimForClaimId(collectionId)(state);
  const uri = (claim && (claim.canonical_url || claim.permanent_url)) || null;

  return {
    collectionId,
    claim,
    collection: makeSelectCollectionForId(collectionId)(state),
    collectionUrls: makeSelectUrlsForCollectionId(collectionId)(state),
    collectionCount: makeSelectCountForCollectionId(collectionId)(state),
    isResolvingCollection: makeSelectIsResolvingCollectionForId(collectionId)(state),
    title: makeSelectTitleForUri(uri)(state),
    thumbnail: makeSelectThumbnailForUri(uri)(state),
    isMyClaim: makeSelectClaimIsMine(uri)(state), // or collection is mine?
    isMyCollection: makeSelectCollectionIsMine(collectionId)(state),
    claimIsPending: makeSelectClaimIsPending(uri)(state),
    collectionHasEdits: Boolean(makeSelectEditedCollectionForId(collectionId)(state)),
    uri,
    user: selectUser(state),
    channel: uri && makeSelectChannelForClaimUri(uri)(state),
  };
};

const perform = (dispatch) => ({
  fetchCollectionItems: (claimId, cb) => dispatch(doFetchItemsInCollection({ collectionId: claimId }, cb)), // if this collection is not resolved, resolve it
  deleteCollection: (id) => dispatch(doLocalCollectionDelete(id)),
  editCollection: (id, params) => dispatch(doCollectionEdit(id, params)),
});

export default withRouter(connect(select, perform)(CollectionPage));
