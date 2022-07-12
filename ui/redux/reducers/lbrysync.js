import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState = {
  registering: false,
  registeredEmail: null,
  registerError: null,
  syncProvider: null,
  isAuthenticating: false,
  authError: null,
  authToken: null, // store this elsewhere?
};

export const lbrysyncReducer = handleActions(
  {
    // Register
    [ACTIONS.LSYNC_REGISTER_STARTED]: (state) => ({
      ...state,
      registering: true,
    }),
    [ACTIONS.LSYNC_REGISTER_COMPLETED]: (state, action) => ({
      ...state,
      registeredEmail: action.data,
    }),
    [ACTIONS.LSYNC_REGISTER_FAILED]: (state) => ({
      ...state,
      registeredEmail: null,
      registering: false,
    }),
    // Auth
    [ACTIONS.LSYNC_AUTH_STARTED]: (state) => ({
      ...state,
      isAuthenticating: true,
    }),
    [ACTIONS.LSYNC_AUTH_COMPLETED]: (state, action) => ({
      ...state,
      authToken: action.data,
    }),
    [ACTIONS.LSYNC_AUTH_FAILED]: (state, action) => ({
      ...state,
      authError: action.data,
      isAuthenticating: false,
    }),
    // ...
  },
  defaultState
);
