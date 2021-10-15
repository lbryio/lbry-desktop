import { createSelector } from 'reselect';

const selectState = state => state.homepage || {};

export const selectFeaturedUris = createSelector(selectState, state => state.featuredUris);

export const selectFetchingFeaturedUris = createSelector(
  selectState,
  state => state.fetchingFeaturedContent
);

export const selectTrendingUris = createSelector(selectState, state => state.trendingUris);

export const selectFetchingTrendingUris = createSelector(
  selectState,
  state => state.fetchingTrendingContent
);
