import * as types from "constants/action_types";

const reducers = {};
const defaultState = {};

reducers[types.DAEMON_SETTINGS_RECEIVED] = function(state, action) {
  return Object.assign({}, state, {
    daemonSettings: action.data.settings,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
