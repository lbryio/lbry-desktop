// @flow
import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';
import { selectMyClaims, selectPendingClaims } from 'redux/selectors/claims';

type State = { livestream: any };

const selectState = (state: State) => state.livestream || {};

export const selectFetchingLivestreams = (state: State) => selectState(state).fetchingById;
export const selectViewersById = (state: State) => selectState(state).viewersById;
export const selectActiveLivestreams = (state: State) => selectState(state).activeLivestreams;
export const selectFetchingActiveLivestreams = (state: State) => selectState(state).fetchingActiveLivestreams;
export const selectActiveLivestreamInitialized = (state: State) => selectState(state).activeLivestreamInitialized;

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

export const selectIsActiveLivestreamForUri = createCachedSelector(
  (state, uri) => uri,
  selectActiveLivestreams,
  (uri, activeLivestreams) => {
    if (!uri || !activeLivestreams) {
      return false;
    }

    const activeLivestreamValues = Object.values(activeLivestreams);
    // $FlowFixMe - unable to resolve claimUri
    return activeLivestreamValues.some((v) => v.claimUri === uri);
  }
)((state, uri) => String(uri));

export const selectActiveLivestreamForClaimId = createCachedSelector(
  (state, claimId) => claimId,
  selectActiveLivestreams,
  (claimId, activeLivestreams) => {
    if (!claimId || !activeLivestreams) {
      return null;
    }

    const activeLivestreamValues = Object.values(activeLivestreams);
    // $FlowFixMe - https://github.com/facebook/flow/issues/2221
    return activeLivestreamValues.find((v) => v.claimId === claimId) || null;
  }
)((state, claimId) => String(claimId));

export const selectActiveLivestreamForChannel = createCachedSelector(
  (state, channelId) => channelId,
  selectActiveLivestreams,
  (channelId, activeLivestreams) => {
    if (!channelId || !activeLivestreams) {
      return null;
    }
    return activeLivestreams[channelId] || null;
  }
)((state, channelId) => String(channelId));
