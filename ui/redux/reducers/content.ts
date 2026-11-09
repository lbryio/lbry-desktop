//@ts-nocheck
import * as ACTIONS from 'constants/action_types';

const reducers: Record<string, any> = {};
const defaultState = {
  primaryUri: null, // Top level content uri triggered from the file page
  playingUri: null,
  channelClaimCounts: {},
  positions: {},
  history: [],
  recommendationId: {}, // { "claimId": "recommendationId" }
  recommendationParentId: {}, // { "claimId": "referrerId" }
  recommendationUrls: {}, // { "claimId": [lbryUrls...] }
  recommendationClicks: {}, // { "claimId": [clicked indices...] }
} as const;

reducers[ACTIONS.SET_PRIMARY_URI] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    primaryUri: action.data.uri,
  });

reducers[ACTIONS.SET_PLAYING_URI] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    playingUri: {
      uri: action.data.uri,
      source: action.data.source,
      pathname: action.data.pathname,
      commentId: action.data.commentId,
      collectionId: action.data.collectionId,
      primaryUri: state.primaryUri,
    },
  });

reducers[ACTIONS.TOGGLE_LOOP_LIST] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    loopList: {
      collectionId: action.data.collectionId,
      loop: action.data.loop,
    },
  });

reducers[ACTIONS.TOGGLE_SHUFFLE_LIST] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    shuffleList: {
      collectionId: action.data.collectionId,
      newUrls: action.data.newUrls,
    },
  });

reducers[ACTIONS.SET_CONTENT_POSITION] = (state: unknown, action: unknown) => {
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

reducers[ACTIONS.CLEAR_CONTENT_POSITION] = (state: unknown, action: unknown) => {
  const { claimId, outpoint } = action.data;

  if (state.positions[claimId]) {
    const numOutpoints = Object.keys(state.positions[claimId]).length;
    if (numOutpoints <= 1) {
      let positions = { ...state.positions };
      delete positions[claimId];

      return {
        ...state,
        positions: positions,
      };
    } else {
      let outpoints = { ...state.positions[claimId] };
      delete outpoints[outpoint];

      return {
        ...state,
        positions: {
          ...state.positions,
          [claimId]: outpoints,
        },
      };
    }
  } else {
    return state;
  }
};

reducers[ACTIONS.CLEAR_CONTENT_CACHE] = (state: unknown, action: unknown) => {
  return {
    ...state,
    positions: {},
  };
};

reducers[ACTIONS.SET_CONTENT_LAST_VIEWED] = (state: unknown, action: unknown) => {
  const { uri, lastViewed } = action.data;
  const { history } = state;
  const historyObj = { uri, lastViewed } as const;
  const index = history.findIndex((i) => i.uri === uri);
  const newHistory =
    index === -1
      ? [historyObj].concat(history)
      : [historyObj].concat(history.slice(0, index), history.slice(index + 1));
  return { ...state, history: [...newHistory] };
};

reducers[ACTIONS.CLEAR_CONTENT_HISTORY_URI] = (state: unknown, action: unknown) => {
  const { uri } = action.data;
  const { history } = state;
  const index = history.findIndex((i) => i.uri === uri);
  return index === -1
    ? state
    : {
        ...state,
        history: history.slice(0, index).concat(history.slice(index + 1)),
      };
};

reducers[ACTIONS.CLEAR_CONTENT_HISTORY_ALL] = (state: unknown) => ({ ...state, history: [] });

// reducers[LBRY_REDUX_ACTIONS.PURCHASE_URI_FAILED] = (state, action) => {
//   return {
//     ...state,
//     playingUri: null,
//   };
// };

export default function reducer(state = defaultState, action: unknown) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
