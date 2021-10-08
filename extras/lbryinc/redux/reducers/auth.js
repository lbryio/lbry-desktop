import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {
  authenticating: false,
};

reducers[ACTIONS.GENERATE_AUTH_TOKEN_FAILURE] = state =>
  Object.assign({}, state, {
    authToken: null,
    authenticating: false,
  });

reducers[ACTIONS.GENERATE_AUTH_TOKEN_STARTED] = state =>
  Object.assign({}, state, {
    authenticating: true,
  });

reducers[ACTIONS.GENERATE_AUTH_TOKEN_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    authToken: action.data.authToken,
    authenticating: false,
  });

export function authReducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
