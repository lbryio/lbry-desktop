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

const selectResolvingUri = (state, props) => {
  return selectResolvingUris(state).indexOf(props.uri) != -1;
};

export const makeSelectIsResolvingForUri = () => {
  return createSelector(selectResolvingUri, resolving => resolving);
};

export const selectChannelPages = createSelector(
  _selectState,
  state => state.channelPages || {}
);

const selectTotalPagesForChannel = (state, props) => {
  return selectChannelPages(state)[props.uri];
};

export const makeSelectTotalPagesForChannel = () => {
  return createSelector(selectTotalPagesForChannel, totalPages => totalPages);
};
