import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {
  playingUri: null,
  floatingUri: null,
  channelClaimCounts: {},
  positions: {},
  history: [],
};

reducers[ACTIONS.SET_PLAYING_URI] = (state, action) =>
  Object.assign({}, state, {
    playingUri: action.data.uri,
  });

reducers[ACTIONS.SET_FLOATING_URI] = (state, action) =>
  Object.assign({}, state, {
    floatingUri: action.data.uri,
  });

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

reducers[ACTIONS.CLEAR_CONTENT_POSITION] = (state, action) => {
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
