// @flow
import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState: ContentState = {
  primaryUri: null, // Top level content uri triggered from the file page
  playingUri: { uri: undefined, collection: {} },
  channelClaimCounts: {},
  positions: {},
  history: [],
  recommendationId: {},
  recommendationParentId: {},
  recommendationUrls: {},
  recommendationClicks: {},
  lastViewedAnnouncement: [],
  recsysEntries: {},
};

reducers[ACTIONS.SET_PRIMARY_URI] = (state, action) =>
  Object.assign({}, state, {
    primaryUri: action.data.uri,
  });

reducers[ACTIONS.SET_PLAYING_URI] = (state, action) =>
  Object.assign({}, state, { playingUri: { ...action.data, primaryUri: state.primaryUri } });

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
  const index = history.findIndex((i) => i.uri === uri);
  const newHistory =
    index === -1
      ? [historyObj].concat(history)
      : [historyObj].concat(history.slice(0, index), history.slice(index + 1));
  return { ...state, history: [...newHistory] };
};

reducers[ACTIONS.CLEAR_CONTENT_HISTORY_URI] = (state, action) => {
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

reducers[ACTIONS.CLEAR_CONTENT_HISTORY_ALL] = (state) => ({ ...state, history: [] });

reducers[ACTIONS.SET_LAST_VIEWED_ANNOUNCEMENT] = (state, action) => {
  // Since homepages fall back to English if undefined, use an array instead of
  // an object to simplify the logic and overall code-changes.
  // The only flaw is when a particular homepage keeps producing new
  // announcements, the history of other homepages will be pushed out. This
  // scenario is unlikely, so just keep a reasonably large history size to
  // account for this scenario.
  const N_ENTRIES_TO_KEEP = 25;
  const hash = action.data;

  if (hash === 'clear') {
    return { ...state, lastViewedAnnouncement: [] };
  }

  return { ...state, lastViewedAnnouncement: [hash].concat(state.lastViewedAnnouncement).slice(0, N_ENTRIES_TO_KEEP) };
};

reducers[ACTIONS.SET_RECSYS_ENTRIES] = (state, action) => ({ ...state, recsysEntries: action.data });

// reducers[LBRY_REDUX_ACTIONS.PURCHASE_URI_FAILED] = (state, action) => {
//   return {
//     ...state,
//     playingUri: null,
//   };
// };

reducers[ACTIONS.USER_STATE_POPULATE] = (state, action) => {
  const { lastViewedAnnouncement } = action.data;
  // Convert legacy string format to an array:
  const newValue = typeof lastViewedAnnouncement === 'string' ? [lastViewedAnnouncement] : lastViewedAnnouncement || [];
  return { ...state, lastViewedAnnouncement: newValue };
};

export default function reducer(state: ContentState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
