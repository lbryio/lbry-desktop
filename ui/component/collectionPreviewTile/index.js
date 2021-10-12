import { connect } from 'react-redux';
import {
  makeSelectIsUriResolving,
  makeSelectThumbnailForUri,
  makeSelectTitleForUri,
  makeSelectChannelForClaimUri,
  makeSelectClaimIsNsfw,
  makeSelectClaimIdForUri,
  makeSelectClaimForClaimId,
} from 'redux/selectors/claims';
import {
  makeSelectUrlsForCollectionId,
  makeSelectNameForCollectionId,
  makeSelectEditedCollectionForId,
  makeSelectPendingCollectionForId,
  makeSelectCountForCollectionId,
  makeSelectIsResolvingCollectionForId,
} from 'redux/selectors/collections';
import { doFetchItemsInCollection, doCollectionDelete } from 'redux/actions/collections';
import { doResolveUri } from 'redux/actions/claims';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import CollectionPreviewTile from './view';

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
    editedCollection: makeSelectEditedCollectionForId(collectionId)(state),
    pendingCollection: makeSelectPendingCollectionForId(collectionId)(state),
    claim,
    isResolvingCollectionClaims: makeSelectIsResolvingCollectionForId(collectionId)(state),
    channelClaim: collectionUri && makeSelectChannelForClaimUri(collectionUri)(state),
    isResolvingUri: collectionUri && makeSelectIsUriResolving(collectionUri)(state),
    thumbnail: collectionUri && makeSelectThumbnailForUri(collectionUri)(state),
    title: collectionUri && makeSelectTitleForUri(collectionUri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    filteredOutpoints: selectFilteredOutpoints(state),
    blockedChannelUris: selectMutedChannels(state),
    showMature: selectShowMatureContent(state),
    isMature: makeSelectClaimIsNsfw(collectionUri)(state),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  resolveCollectionItems: (options) => doFetchItemsInCollection(options),
  deleteCollection: (id) => dispatch(doCollectionDelete(id)),
});

export default connect(select, perform)(CollectionPreviewTile);
