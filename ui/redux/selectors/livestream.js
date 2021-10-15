// @flow
import { createSelector } from 'reselect';
import { selectMyClaims, selectPendingClaims } from 'redux/selectors/claims';

const selectState = (state) => state.livestream || {};

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

export const selectFetchingLivestreams = createSelector(selectState, (state) => state.fetchingById);
export const selectViewersById = createSelector(selectState, (state) => state.viewersById);

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

export const selectActiveLivestreams = createSelector(selectState, (state) => state.activeLivestreams);

export const makeSelectIsActiveLivestream = (uri: string) =>
  createSelector(selectState, (state) => {
    const activeLivestreamValues = (state.activeLivestreams && Object.values(state.activeLivestreams)) || [];
    // $FlowFixMe
    return Boolean(activeLivestreamValues.find((v) => v.latestClaimUri === uri));
  });

export const makeSelectActiveLivestreamUris = (uri: string) =>
  createSelector(selectState, (state) => {
    const activeLivestreamValues = (state.activeLivestreams && Object.values(state.activeLivestreams)) || [];
    const uris = [];
    activeLivestreamValues.forEach((v) => {
      // $FlowFixMe
      if (v.latestClaimUri) uris.push(v.latestClaimUri);
    });
    return uris;
  });
