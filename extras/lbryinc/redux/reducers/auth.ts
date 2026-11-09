//@ts-nocheck
import * as ACTIONS from 'constants/action_types';

const reducers: Record<string, any> = {};
const defaultState = {
  authenticating: false,
} as const;

reducers[ACTIONS.GENERATE_AUTH_TOKEN_FAILURE] = (state: unknown) =>
  Object.assign({}, state, {
    authToken: null,
    authenticating: false,
  });

reducers[ACTIONS.GENERATE_AUTH_TOKEN_STARTED] = (state: unknown) =>
  Object.assign({}, state, {
    authenticating: true,
  });

reducers[ACTIONS.GENERATE_AUTH_TOKEN_SUCCESS] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    authToken: action.data.authToken,
    authenticating: false,
  });

export function authReducer(state = defaultState, action: unknown) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
