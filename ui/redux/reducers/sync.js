import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {
  hasSyncedWallet: false,
  syncHash: null,
  syncData: null,
  setSyncErrorMessage: null,
  getSyncErrorMessage: null,
  syncApplyErrorMessage: '',
  syncApplyIsPending: false,
  syncApplyPasswordError: false,
  getSyncIsPending: false,
  setSyncIsPending: false,
  prefsReady: false,
  syncLocked: false,
  hashChanged: false,
  fatalError: false,
  // lbrysync
  // --email
  checkingEmail: false,
  candidateEmail: null,
  emailError: null,
  //syncProvider: null,
  gettingSalt: false,
  saltSeed: null,
  saltError: null,
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
  encryptedDataKey: null,
};

reducers[ACTIONS.SYNC_STATE_POPULATE] = (state) => {
  const { syncReady } = state;
  if (!syncReady) {
    return Object.assign({}, state, {
      prefsReady: true,
    });
  } else {
    return Object.assign({}, state);
  }
};

reducers[ACTIONS.SET_PREFS_READY] = (state, action) => Object.assign({}, state, { prefsReady: action.data });

reducers[ACTIONS.GET_SYNC_STARTED] = (state) =>
  Object.assign({}, state, {
    getSyncIsPending: true,
    getSyncErrorMessage: null,
  });

reducers[ACTIONS.SET_SYNC_LOCK] = (state, action) =>
  Object.assign({}, state, {
    syncLocked: action.data,
  });

reducers[ACTIONS.GET_SYNC_COMPLETED] = (state, action) =>
  Object.assign({}, state, {
    syncHash: action.data.syncHash,
    syncData: action.data.syncData,
    hasSyncedWallet: action.data.hasSyncedWallet,
    getSyncIsPending: false,
    hashChanged: action.data.hashChanged,
    fatalError: action.data.fatalError,
  });

reducers[ACTIONS.GET_SYNC_FAILED] = (state, action) =>
  Object.assign({}, state, {
    getSyncIsPending: false,
    getSyncErrorMessage: action.data.error,
  });

reducers[ACTIONS.SET_SYNC_STARTED] = (state) =>
  Object.assign({}, state, {
    setSyncIsPending: true,
    setSyncErrorMessage: null,
  });

reducers[ACTIONS.SET_SYNC_FAILED] = (state, action) =>
  Object.assign({}, state, {
    setSyncIsPending: false,
    setSyncErrorMessage: action.data.error,
  });

reducers[ACTIONS.SET_SYNC_COMPLETED] = (state, action) =>
  Object.assign({}, state, {
    setSyncIsPending: false,
    setSyncErrorMessage: null,
    hasSyncedWallet: true, // sync was successful, so the user has a synced wallet at this point
    syncHash: action.data.syncHash,
  });

reducers[ACTIONS.SYNC_APPLY_STARTED] = (state) =>
  Object.assign({}, state, {
    syncApplyPasswordError: false,
    syncApplyIsPending: true,
    syncApplyErrorMessage: '',
  });

reducers[ACTIONS.SYNC_APPLY_COMPLETED] = (state) =>
  Object.assign({}, state, {
    syncApplyIsPending: false,
    syncApplyErrorMessage: '',
  });

reducers[ACTIONS.SYNC_APPLY_FAILED] = (state, action) =>
  Object.assign({}, state, {
    syncApplyIsPending: false,
    syncApplyErrorMessage: action.data.error,
  });

reducers[ACTIONS.SYNC_APPLY_BAD_PASSWORD] = (state) =>
  Object.assign({}, state, {
    syncApplyPasswordError: true,
  });

reducers[ACTIONS.SYNC_FATAL_ERROR] = (state) => {
  return Object.assign({}, state, {
    fatalError: true,
  });
};
// lbrysync
reducers[ACTIONS.LSYNC_REGISTER_STARTED] = (state) => ({
  ...state,
  registering: true,
  registerError: null,
});
reducers[ACTIONS.LSYNC_REGISTER_COMPLETED] = (state, action) => ({
  ...state,
  registeredEmail: action.data.email,
  encryptedHmacKey: action.data.hmacKey,
  encryptedDataKey: action.data.dataKey,
  encryptedProviderKey: action.data.providerKey,
  encryptedRoot: action.data.rootPass,
  saltSeed: action.data.saltSeed,
  syncProvider: action.data.syncProvider,
  registering: false,
});
// clear attempt
reducers[ACTIONS.LSYNC_REGISTER_FAILED] = (state, action) => ({
  ...state,
  registeredEmail: null,
  registering: false,
  registerError: action.data.error,
});
// Auth
reducers[ACTIONS.LSYNC_AUTH_STARTED] = (state) => ({
  ...state,
  isAuthenticating: true,
  authError: null,
});
reducers[ACTIONS.LSYNC_AUTH_COMPLETED] = (state, action) => ({
  ...state,
  authToken: action.data,
});
reducers[ACTIONS.LSYNC_AUTH_FAILED] = (state, action) => ({
  ...state,
  authError: action.data,
  isAuthenticating: false,
});
// derive
reducers[ACTIONS.LSYNC_DERIVE_STARTED] = (state) => ({
  ...state,
  derivingKeys: true,
  deriveError: null,
});
// add more keys
reducers[ACTIONS.LSYNC_DERIVE_COMPLETED] = (state, action) => ({
  ...state,
  derivingKeys: false,
});
reducers[ACTIONS.LSYNC_DERIVE_FAILED] = (state, action) => ({
  ...state,
  deriveError: action.data.error,
  derivingKeys: false,
});
// salt util
reducers[ACTIONS.LSYNC_GET_SALT_STARTED] = (state) => ({
  ...state,
  gettingSalt: true,
  saltError: null,
});
reducers[ACTIONS.LSYNC_GET_SALT_COMPLETED] = (state, action) => ({
  ...state,
  gettingSalt: false,
});
reducers[ACTIONS.LSYNC_GET_SALT_FAILED] = (state, action) => ({
  ...state,
  saltError: action.data.error,
  gettingSalt: false,
});
// email
reducers[ACTIONS.LSYNC_CHECK_EMAIL_STARTED] = (state) => ({
  ...state,
  checkingEmail: true,
  emailError: null,
  candidateEmail: null,
  saltSeed: null,
});
reducers[ACTIONS.LSYNC_CHECK_EMAIL_COMPLETED] = (state, action) => ({
  ...state,
  checkingEmail: false,
  candidateEmail: action.data.candidateEmail,
  saltSeed: action.data.saltSeed,
});
reducers[ACTIONS.LSYNC_CHECK_EMAIL_FAILED] = (state, action) => ({
  ...state,
  checkingEmail: false,
  emailError: action.data.emailError,
  candidateEmail: null,
  saltSeed: null,
});

reducers[ACTIONS.SYNC_RESET] = () => defaultState;

export default function syncReducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
