const selectState = (state) => state.homepage || {};

export const selectFeaturedUris = (state) => selectState(state).featuredUris;
export const selectFetchingFeaturedUris = (state) => selectState(state).fetchingFeaturedContent;
export const selectTrendingUris = (state) => selectState(state).trendingUris;
export const selectFetchingTrendingUris = (state) => selectState(state).fetchingTrendingContent;
