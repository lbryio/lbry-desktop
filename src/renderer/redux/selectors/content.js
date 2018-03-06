import { createSelector } from 'reselect';

export const selectState = state => state.content || {};

export const selectFeaturedUris = createSelector(selectState, state => state.featuredUris);

export const selectFeaturedChannels = createSelector(selectState, state => state.featuredChannels);

export const selectFetchingFeaturedUris = createSelector(
  selectState,
  state => state.fetchingFeaturedContent
);

export const selectResolvingUris = createSelector(selectState, state => state.resolvingUris || []);

export const selectPlayingUri = createSelector(selectState, state => state.playingUri);

export const makeSelectIsUriResolving = uri =>
  createSelector(
    selectResolvingUris,
    resolvingUris => resolvingUris && resolvingUris.indexOf(uri) !== -1
  );

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
