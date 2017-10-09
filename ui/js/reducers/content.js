import * as types from "constants/action_types";

const reducers = {};
const defaultState = {
  playingUri: null,
  rewardedContentClaimIds: [],
  channelPages: {},
};

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

reducers[types.FETCH_REWARD_CONTENT_COMPLETED] = function(state, action) {
  const { claimIds, success } = action.data;

  return Object.assign({}, state, {
    rewardedContentClaimIds: claimIds,
  });
};

reducers[types.RESOLVE_URIS_STARTED] = function(state, action) {
  let { uris } = action.data;

  const oldResolving = state.resolvingUris || [];
  const newResolving = Object.assign([], oldResolving);

  for (let uri of uris) {
    if (!newResolving.includes(uri)) {
      newResolving.push(uri);
    }
  }

  return Object.assign({}, state, {
    resolvingUris: newResolving,
  });
};

reducers[types.SET_PLAYING_URI] = (state, action) => {
  return Object.assign({}, state, {
    playingUri: action.data.uri,
  });
};

// reducers[types.FETCH_CHANNEL_CLAIMS_COMPLETED] = function(state, action) {
//   const channelPages = Object.assign({}, state.channelPages);
//   const { uri, claims } = action.data;
//
//   channelPages[uri] = totalPages;
//
//   return Object.assign({}, state, {
//     channelPages,
//   });
// };

reducers[types.FETCH_CHANNEL_CLAIM_COUNT_COMPLETED] = function(state, action) {
  const channelPages = Object.assign({}, state.channelPages);
  const { uri, totalClaims } = action.data;

  channelPages[uri] = Math.ceil(totalClaims / 10);

  return Object.assign({}, state, {
    channelPages,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
