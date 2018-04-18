import { createSelector } from 'reselect';

export const selectState = state => state.content || {};

export const selectFeaturedUris = createSelector(selectState, state => state.featuredUris);

export const selectFetchingFeaturedUris = createSelector(
  selectState,
  state => state.fetchingFeaturedContent
);

export const selectPlayingUri = createSelector(selectState, state => state.playingUri);

export const selectChannelClaimCounts = createSelector(
  selectState,
  state => state.channelClaimCounts || {}
);

export const makeSelectTotalItemsForChannel = uri =>
  createSelector(selectChannelClaimCounts, byUri => byUri && byUri[uri]);

export const makeSelectTotalPagesForChannel = uri =>
  createSelector(
    selectChannelClaimCounts,
    byUri => byUri && byUri[uri] && Math.ceil(byUri[uri] / 10)
  );

export const selectRewardContentClaimIds = createSelector(
  selectState,
  state => state.rewardedContentClaimIds
);
