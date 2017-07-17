import * as types from "constants/action_types";

const reducers = {};
const defaultState = {};

reducers[types.FETCH_FEATURED_CONTENT_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    fetchingFeaturedContent: true,
  });
};

reducers[types.FETCH_FEATURED_CONTENT_COMPLETED] = function(state, action) {
  const { uris, success } = action.data;

  return Object.assign({}, state, {
    fetchingFeaturedContent: false,
    fetchingFeaturedContentFailed: !success,
    featuredUris: uris,
  });
};

reducers[types.RESOLVE_URI_STARTED] = function(state, action) {
  const { uri } = action.data;

  const oldResolving = state.resolvingUris || [];
  const newResolving = Object.assign([], oldResolving);
  if (newResolving.indexOf(uri) === -1) newResolving.push(uri);

  return Object.assign({}, state, {
    resolvingUris: newResolving,
  });
};

reducers[types.RESOLVE_URI_CANCELED] = reducers[
  types.RESOLVE_URI_COMPLETED
] = function(state, action) {
  const { uri } = action.data;
  const resolvingUris = state.resolvingUris;
  const index = state.resolvingUris.indexOf(uri);
  const newResolvingUris = [
    ...resolvingUris.slice(0, index),
    ...resolvingUris.slice(index + 1),
  ];

  return Object.assign({}, state, {
    resolvingUris: newResolvingUris,
  });
};

reducers[types.FETCH_CHANNEL_CLAIMS_COMPLETED] = function(state, action) {
  const channelPages = Object.assign({}, state.channelPages);
  const { uri, totalPages } = action.data;

  channelPages[uri] = totalPages;

  return Object.assign({}, state, {
    channelPages,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
