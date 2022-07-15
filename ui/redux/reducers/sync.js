// @flow
import * as ACTIONS from 'constants/action_types';

const reducers = {};

const defaultState: SyncState = {
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
  sharedStateSyncId: -1,
  hashChanged: false,
  fatalError: false,
};

reducers[ACTIONS.USER_STATE_POPULATE] = (state: SyncState) => {
  // $FlowFixMe - 'syncReady' doesn't exist. A bug?
  const { syncReady } = state;
  if (!syncReady) {
    return Object.assign({}, state, {
      prefsReady: true,
    });
  } else {
    return Object.assign({}, state);
  }
};

reducers[ACTIONS.SET_PREFS_READY] = (state: SyncState, action: any) =>
  Object.assign({}, state, { prefsReady: action.data });

reducers[ACTIONS.GET_SYNC_STARTED] = (state: SyncState) =>
  Object.assign({}, state, {
    getSyncIsPending: true,
    getSyncErrorMessage: null,
  });

reducers[ACTIONS.SET_SYNC_LOCK] = (state: SyncState, action: any) =>
  Object.assign({}, state, {
    syncLocked: action.data,
  });

reducers[ACTIONS.GET_SYNC_COMPLETED] = (state: SyncState, action: any) =>
  Object.assign({}, state, {
    syncHash: action.data.syncHash,
    syncData: action.data.syncData,
    hasSyncedWallet: action.data.hasSyncedWallet,
    getSyncIsPending: false,
    hashChanged: action.data.hashChanged,
    fatalError: action.data.fatalError,
  });

reducers[ACTIONS.GET_SYNC_FAILED] = (state: SyncState, action: any) =>
  Object.assign({}, state, {
    getSyncIsPending: false,
    getSyncErrorMessage: action.data.error,
  });

reducers[ACTIONS.SET_SYNC_STARTED] = (state: SyncState) =>
  Object.assign({}, state, {
    setSyncIsPending: true,
    setSyncErrorMessage: null,
  });

reducers[ACTIONS.SET_SYNC_FAILED] = (state: SyncState, action: any) =>
  Object.assign({}, state, {
    setSyncIsPending: false,
    setSyncErrorMessage: action.data.error,
  });

reducers[ACTIONS.SET_SYNC_COMPLETED] = (state: SyncState, action: any) =>
  Object.assign({}, state, {
    setSyncIsPending: false,
    setSyncErrorMessage: null,
    hasSyncedWallet: true, // sync was successful, so the user has a synced wallet at this point
    syncHash: action.data.syncHash,
  });

reducers[ACTIONS.SYNC_APPLY_STARTED] = (state: SyncState) =>
  Object.assign({}, state, {
    syncApplyPasswordError: false,
    syncApplyIsPending: true,
    syncApplyErrorMessage: '',
  });

reducers[ACTIONS.SYNC_APPLY_COMPLETED] = (state: SyncState) =>
  Object.assign({}, state, {
    syncApplyIsPending: false,
    syncApplyErrorMessage: '',
  });

reducers[ACTIONS.SYNC_APPLY_FAILED] = (state: SyncState, action: any) =>
  Object.assign({}, state, {
    syncApplyIsPending: false,
    syncApplyErrorMessage: action.data.error,
  });

reducers[ACTIONS.SYNC_APPLY_BAD_PASSWORD] = (state: SyncState) =>
  Object.assign({}, state, {
    syncApplyPasswordError: true,
  });

reducers[ACTIONS.SYNC_FATAL_ERROR] = (state: SyncState) => {
  return Object.assign({}, state, {
    fatalError: true,
  });
};

reducers[ACTIONS.SYNC_RESET] = () => defaultState;

reducers[ACTIONS.SHARED_STATE_SYNC_ID_CHANGED] = (state: SyncState, action: any) => {
  return { ...state, sharedStateSyncId: action.data };
};

export default function syncReducer(state: SyncState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
