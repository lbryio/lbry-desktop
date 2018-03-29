import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {
  playingUri: null,
  currentlyIsPlaying: false,
  rewardedContentClaimIds: [],
  channelClaimCounts: {},
};

reducers[ACTIONS.FETCH_FEATURED_CONTENT_STARTED] = state =>
  Object.assign({}, state, {
    fetchingFeaturedContent: true,
  });

reducers[ACTIONS.FETCH_FEATURED_CONTENT_COMPLETED] = (state, action) => {
  const { uris, success } = action.data;

  return Object.assign({}, state, {
    fetchingFeaturedContent: false,
    fetchingFeaturedContentFailed: !success,
    featuredUris: uris,
  });
};

reducers[ACTIONS.FETCH_REWARD_CONTENT_COMPLETED] = (state, action) => {
  const { claimIds } = action.data;

  return Object.assign({}, state, {
    rewardedContentClaimIds: claimIds,
  });
};

reducers[ACTIONS.RESOLVE_URIS_STARTED] = (state, action) => {
  const { uris } = action.data;

  const oldResolving = state.resolvingUris || [];
  const newResolving = Object.assign([], oldResolving);

  uris.forEach(uri => {
    if (!newResolving.includes(uri)) {
      newResolving.push(uri);
    }
  });

  return Object.assign({}, state, {
    resolvingUris: newResolving,
  });
};

reducers[ACTIONS.RESOLVE_URIS_COMPLETED] = (state, action) => {
  const { resolveInfo } = action.data;
  const channelClaimCounts = Object.assign({}, state.channelClaimCounts);

  Object.entries(resolveInfo).forEach(([uri, { certificate, claimsInChannel }]) => {
    if (certificate && !Number.isNaN(claimsInChannel)) {
      channelClaimCounts[uri] = claimsInChannel;
    }
  });

  return Object.assign({}, state, {
    channelClaimCounts,
    resolvingUris: (state.resolvingUris || []).filter(uri => !resolveInfo[uri]),
  });
};

reducers[ACTIONS.SET_PLAYING_URI] = (state, action) =>
  Object.assign({}, state, {
    playingUri: action.data.uri,
  });

reducers[ACTIONS.FETCH_CHANNEL_CLAIM_COUNT_COMPLETED] = (state, action) => {
  const channelClaimCounts = Object.assign({}, state.channelClaimCounts);
  const { uri, totalClaims } = action.data;

  channelClaimCounts[uri] = totalClaims;

  return Object.assign({}, state, {
    channelClaimCounts,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
