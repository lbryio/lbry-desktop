import * as types from "constants/action_types";

const reducers = {};
const defaultState = {
  playingUri: null,
  rewardedContentClaimIds: [],
  channelClaimCounts: {},
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

reducers[types.RESOLVE_URIS_COMPLETED] = function(state, action) {
  const { resolveInfo } = action.data;
  const channelClaimCounts = Object.assign({}, state.channelClaimCounts);

  for (let [uri, { certificate, claims_in_channel }] of Object.entries(
    resolveInfo
  )) {
    if (certificate && !isNaN(claims_in_channel)) {
      channelClaimCounts[uri] = claims_in_channel;
    }
  }

  return Object.assign({}, state, {
    channelClaimCounts,
    resolvingUris: (state.resolvingUris || []).filter(uri => !resolveInfo[uri]),
  });
};

reducers[types.SET_PLAYING_URI] = (state, action) => {
  return Object.assign({}, state, {
    playingUri: action.data.uri,
  });
};

reducers[types.FETCH_CHANNEL_CLAIM_COUNT_COMPLETED] = function(state, action) {
  const channelClaimCounts = Object.assign({}, state.channelClaimCounts);
  const { uri, totalClaims } = action.data;

  channelClaimCounts[uri] = totalClaims;

  return Object.assign({}, state, {
    channelClaimCounts,
  });
};

reducers[types.SET_CURRENT_TIME] = function(state, action) {
  return Object.assign({}, state, {
    currentTime: action.data.currentTime,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
