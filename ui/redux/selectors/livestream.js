// @flow
import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';
import { selectMyClaims, selectPendingClaims } from 'redux/selectors/claims';

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

export const makeSelectViewersForId = (channelId: string) =>
  createSelector(selectViewersById, (viewers) => viewers[channelId]);

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
