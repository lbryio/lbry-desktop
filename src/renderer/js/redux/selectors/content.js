import { createSelector } from "reselect";

export const _selectState = state => state.content || {};

export const selectFeaturedUris = createSelector(
  _selectState,
  state => state.featuredUris
);

export const selectFetchingFeaturedUris = createSelector(
  _selectState,
  state => !!state.fetchingFeaturedContent
);

export const selectResolvingUris = createSelector(
  _selectState,
  state => state.resolvingUris || []
);

export const selectPlayingUri = createSelector(
  _selectState,
  state => state.playingUri
);

export const makeSelectIsUriResolving = uri => {
  return createSelector(
    selectResolvingUris,
    resolvingUris => resolvingUris && resolvingUris.indexOf(uri) != -1
  );
};

export const selectChannelClaimCounts = createSelector(
  _selectState,
  state => state.channelClaimCounts || {}
);

export const makeSelectTotalItemsForChannel = uri => {
  return createSelector(selectChannelClaimCounts, byUri => byUri && byUri[uri]);
};

export const makeSelectTotalPagesForChannel = uri => {
  return createSelector(
    selectChannelClaimCounts,
    byUri => byUri && byUri[uri] && Math.ceil(byUri[uri] / 10)
  );
};

export const selectRewardContentClaimIds = createSelector(
  _selectState,
  state => state.rewardedContentClaimIds
);

export const selectCurrentTime = createSelector(
  _selectState,
  state => state.currentTime
);
