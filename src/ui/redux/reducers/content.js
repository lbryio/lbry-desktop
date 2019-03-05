import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {
  playingUri: null,
  rewardedContentClaimIds: [],
  channelClaimCounts: {},
  positions: {},
  history: [],
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

reducers[ACTIONS.SET_CONTENT_POSITION] = (state, action) => {
  const { claimId, outpoint, position } = action.data;
  return {
    ...state,
    positions: {
      ...state.positions,
      [claimId]: {
        ...state.positions[claimId],
        [outpoint]: position,
      },
    },
  };
};

reducers[ACTIONS.SET_CONTENT_LAST_VIEWED] = (state, action) => {
  const { uri, lastViewed } = action.data;
  const { history } = state;
  const historyObj = { uri, lastViewed };
  const index = history.findIndex(i => i.uri === uri);
  const newHistory =
    index === -1
      ? [historyObj].concat(history)
      : [historyObj].concat(history.slice(0, index), history.slice(index + 1));
  return { ...state, history: [...newHistory] };
};

reducers[ACTIONS.CLEAR_CONTENT_HISTORY_URI] = (state, action) => {
  const { uri } = action.data;
  const { history } = state;
  const index = history.findIndex(i => i.uri === uri);
  return index === -1
    ? state
    : {
        ...state,
        history: history.slice(0, index).concat(history.slice(index + 1)),
      };
};

reducers[ACTIONS.CLEAR_CONTENT_HISTORY_ALL] = state => ({ ...state, history: [] });

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
