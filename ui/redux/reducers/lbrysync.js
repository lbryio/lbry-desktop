import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState = {
  syncProvider: null,
  // reg
  registering: false,
  registeredEmail: null,
  registerError: null,
  // authtoken
  isAuthenticating: false,
  authError: null,
  authToken: null, // store this elsewhere
  // keys
  derivingKeys: false,
  encryptedHmacKey: null,
  encryptedRoot: null,
  encryptedProviderPass: null,
  // salt
  gettingSalt: false,
  saltSeed: null,
  saltError: null,
};

export const lbrysyncReducer = handleActions(
  {
    // Register
    [ACTIONS.LSYNC_REGISTER_STARTED]: (state) => ({
      ...state,
      registering: true,
      registerError: null,
    }),
    [ACTIONS.LSYNC_REGISTER_COMPLETED]: (state, action) => ({
      ...state,
      registeredEmail: action.data.email,
      encryptedHmacKey: action.data.hmacKey,
      encryptedProviderPass: action.data.providerPass,
      encryptedRoot: action.data.rootPass,
      saltSeed: action.data.saltSeed,
    }),
    [ACTIONS.LSYNC_REGISTER_FAILED]: (state, action) => ({
      ...state,
      registeredEmail: null,
      registering: false,
      registerError: action.data.error,
    }),
    // Auth
    [ACTIONS.LSYNC_AUTH_STARTED]: (state) => ({
      ...state,
      isAuthenticating: true,
      authError: null,
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
    // derive
    [ACTIONS.LSYNC_DERIVE_STARTED]: (state) => ({
      ...state,
      derivingKeys: true,
      deriveError: null,
    }),
    [ACTIONS.LSYNC_DERIVE_COMPLETED]: (state, action) => ({
      ...state,
      derivingKeys: false,
    }),
    [ACTIONS.LSYNC_DERIVE_FAILED]: (state, action) => ({
      ...state,
      deriveError: action.data.error,
      derivingKeys: false,
    }),
    // salt
    [ACTIONS.LSYNC_GET_SALT_STARTED]: (state) => ({
      ...state,
      gettingSalt: true,
      saltError: null,
    }),
    [ACTIONS.LSYNC_GET_SALT_COMPLETED]: (state, action) => ({
      ...state,
      gettingSalt: false,
    }),
    [ACTIONS.LSYNC_GET_SALT_FAILED]: (state, action) => ({
      ...state,
      saltError: action.data.error,
      gettingSalt: false,
    }),
  },
  defaultState
);
