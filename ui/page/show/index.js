import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  selectClaimForUri,
  selectIsUriResolving,
  selectClaimIsMine,
  makeSelectClaimIsPending,
  selectGeoRestrictionForUri,
  selectLatestClaimForUri,
} from 'redux/selectors/claims';
import {
  selectCollectionForId,
  selectUrlsForCollectionId,
  selectIsResolvingCollectionForId,
} from 'redux/selectors/collections';
import { selectHomepageFetched, selectUserVerifiedEmail } from 'redux/selectors/user';
import { doResolveUri, doFetchLatestClaimForChannel } from 'redux/actions/claims';
import { doBeginPublish } from 'redux/actions/publish';
import { doOpenModal } from 'redux/actions/app';
import { doFetchItemsInCollection } from 'redux/actions/collections';
import { isStreamPlaceholderClaim } from 'util/claim';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectBlacklistedOutpointMap } from 'lbryinc';
import { selectActiveLiveClaimForChannel } from 'redux/selectors/livestream';
import { doFetchChannelLiveStatus } from 'redux/actions/livestream';
import ShowPage from './view';

const select = (state, props) => {
  const { uri, location, liveContentPath } = props;
  const { search } = location;

  const urlParams = new URLSearchParams(search);

  const claim = selectClaimForUri(state, uri);
  const collectionId =
    urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) ||
    (claim && claim.value_type === 'collection' && claim.claim_id) ||
    null;

  const { canonical_url: canonicalUrl, claim_id: claimId } = claim || {};
  const latestContentClaim = liveContentPath
    ? selectActiveLiveClaimForChannel(state, claimId)
    : selectLatestClaimForUri(state, canonicalUrl);
  const latestClaimUrl = latestContentClaim && latestContentClaim.canonical_url;

  return {
    uri,
    claim,
    latestClaimUrl,
    isResolvingUri: selectIsUriResolving(state, uri),
    blackListedOutpointMap: selectBlacklistedOutpointMap(state),
    isSubscribed: selectIsSubscribedForUri(state, uri),
    claimIsMine: selectClaimIsMine(state, claim),
    claimIsPending: makeSelectClaimIsPending(uri)(state),
    isLivestream: isStreamPlaceholderClaim(claim),
    collection: selectCollectionForId(state, collectionId),
    collectionId,
    collectionUrls: selectUrlsForCollectionId(state, collectionId),
    isResolvingCollection: selectIsResolvingCollectionForId(state, collectionId),
    isAuthenticated: selectUserVerifiedEmail(state),
    geoRestriction: selectGeoRestrictionForUri(state, uri),
    homepageFetched: selectHomepageFetched(state),
  };
};

const perform = {
  doResolveUri,
  doBeginPublish,
  doFetchItemsInCollection,
  doOpenModal,
  fetchLatestClaimForChannel: doFetchLatestClaimForChannel,
  fetchChannelLiveStatus: doFetchChannelLiveStatus,
};

export default withRouter(connect(select, perform)(ShowPage));
