import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  selectClaimForUri,
  selectIsUriResolving,
  selectClaimIsMine,
  makeSelectClaimIsPending,
  selectGeoRestrictionForUri,
} from 'redux/selectors/claims';
import {
  makeSelectCollectionForId,
  makeSelectUrlsForCollectionId,
  makeSelectIsResolvingCollectionForId,
} from 'redux/selectors/collections';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { doResolveUri } from 'redux/actions/claims';
import { doBeginPublish } from 'redux/actions/publish';
import { doOpenModal } from 'redux/actions/app';
import { doFetchItemsInCollection } from 'redux/actions/collections';
import { isStreamPlaceholderClaim } from 'util/claim';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectBlacklistedOutpointMap } from 'lbryinc';
import ShowPage from './view';

const select = (state, props) => {
  const { uri, location } = props;
  const { search } = location;

  const urlParams = new URLSearchParams(search);

  const claim = selectClaimForUri(state, uri);
  const collectionId =
    urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) ||
    (claim && claim.value_type === 'collection' && claim.claim_id) ||
    null;

  return {
    uri,
    claim,
    isResolvingUri: selectIsUriResolving(state, uri),
    blackListedOutpointMap: selectBlacklistedOutpointMap(state),
    isSubscribed: selectIsSubscribedForUri(state, uri),
    claimIsMine: selectClaimIsMine(state, claim),
    claimIsPending: makeSelectClaimIsPending(uri)(state),
    isLivestream: isStreamPlaceholderClaim(claim),
    collection: makeSelectCollectionForId(collectionId)(state),
    collectionId,
    collectionUrls: makeSelectUrlsForCollectionId(collectionId)(state),
    isResolvingCollection: makeSelectIsResolvingCollectionForId(collectionId)(state),
    isAuthenticated: selectUserVerifiedEmail(state),
    geoRestriction: selectGeoRestrictionForUri(state, uri),
  };
};

const perform = {
  doResolveUri,
  doBeginPublish,
  doFetchItemsInCollection,
  doOpenModal,
};

export default withRouter(connect(select, perform)(ShowPage));
