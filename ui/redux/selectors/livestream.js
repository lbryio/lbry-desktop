// @flow
import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';
import { selectMyClaims, selectPendingClaims, selectClaimIdsByUri, selectClaimsById } from 'redux/selectors/claims';
import { selectTopLevelCommentsForUri } from 'redux/selectors/comments';
import { selectSubscriptionUris } from 'redux/selectors/subscriptions';

type State = { livestream: any };

const selectState = (state: State) => state.livestream || {};

// select non-pending claims without sources for given channel
export const makeSelectLivestreamsForChannelId = (channelId: string) =>
  createSelector(selectState, selectMyClaims, (livestreamState, myClaims = []) => {
    return myClaims
      .filter(
        (claim) =>
          claim.value_type === 'stream' &&
          claim.value &&
          !claim.value.source &&
          claim.confirmations > 0 &&
          claim.signing_channel &&
          claim.signing_channel.claim_id === channelId
      )
      .sort((a, b) => b.timestamp - a.timestamp); // newest first
  });

export const selectFetchingLivestreams = (state: State) => selectState(state).fetchingById;
export const selectViewersById = (state: State) => selectState(state).viewersById;

export const makeSelectIsFetchingLivestreams = (channelId: string) =>
  createSelector(selectFetchingLivestreams, (fetchingLivestreams) => Boolean(fetchingLivestreams[channelId]));

export const selectViewersForId = (state: State, channelId: string) => {
  const viewers = selectViewersById(state);
  return viewers[channelId];
};

export const makeSelectPendingLivestreamsForChannelId = (channelId: string) =>
  createSelector(selectPendingClaims, (pendingClaims) => {
    return pendingClaims.filter(
      (claim) =>
        claim.value_type === 'stream' &&
        claim.value &&
        !claim.value.source &&
        claim.signing_channel &&
        claim.signing_channel.claim_id === channelId
    );
  });

export const selectActiveLivestreams = (state: State) => selectState(state).activeLivestreams;

export const selectIsActiveLivestreamForUri = createCachedSelector(
  (state, uri) => uri,
  selectActiveLivestreams,
  (uri, activeLivestreams) => {
    if (!uri || !activeLivestreams) {
      return false;
    }

    const activeLivestreamValues = Object.values(activeLivestreams);
    // $FlowFixMe - unable to resolve latestClaimUri
    return activeLivestreamValues.some((v) => v.latestClaimUri === uri);
  }
)((state, uri) => String(uri));

// ****************************************************************************
// Temporary
// ****************************************************************************

// Until ChannelMentions is redesigned, this serves as a cached and leaner
// version of the original code.
export const selectChannelMentionData = createCachedSelector(
  selectClaimIdsByUri,
  selectClaimsById,
  selectTopLevelCommentsForUri,
  selectSubscriptionUris,
  (claimIdsByUri, claimsById, topLevelComments, subscriptionUris) => {
    const commentorUris = [];
    const unresolvedCommentors = [];
    const unresolvedSubscriptions = [];
    const canonicalCommentors = [];
    const canonicalSubscriptions = [];

    topLevelComments.forEach((comment) => {
      const uri = comment.channel_url;

      if (!commentorUris.includes(uri)) {
        // Update: commentorUris
        commentorUris.push(uri);

        // Update: unresolvedCommentors
        const claimId = claimIdsByUri[uri];
        if (claimId === undefined) {
          unresolvedCommentors.push(uri);
        }

        // Update: canonicalCommentors
        const claim = claimsById[claimId];
        if (claim && claim.canonical_url) {
          canonicalCommentors.push(claim.canonical_url);
        }
      }
    });

    subscriptionUris.forEach((uri) => {
      // Update: unresolvedSubscriptions
      const claimId = claimIdsByUri[uri];
      if (claimId === undefined) {
        unresolvedSubscriptions.push(uri);
      }

      // Update: canonicalSubscriptions
      const claim = claimsById[claimId];
      if (claim && claim.canonical_url) {
        canonicalSubscriptions.push(claim.canonical_url);
      }
    });

    return {
      topLevelComments,
      commentorUris,
      unresolvedCommentors,
      canonicalCommentors,
      unresolvedSubscriptions,
      canonicalSubscriptions,
    };
  }
)((state, uri, maxCount) => `${String(uri)}:${maxCount}`);
