//@ts-nocheck
import * as ACTIONS from 'constants/action_types';

const reducers: Record<string, any> = {};
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
  hashChanged: false,
} as const;

reducers[ACTIONS.GET_SYNC_STARTED] = state: unknown =>
  Object.assign({}, state, {
    getSyncIsPending: true,
    getSyncErrorMessage: null,
  });

reducers[ACTIONS.GET_SYNC_COMPLETED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    syncHash: action.data.syncHash,
    syncData: action.data.syncData,
    hasSyncedWallet: action.data.hasSyncedWallet,
    getSyncIsPending: false,
    hashChanged: action.data.hashChanged,
  });

reducers[ACTIONS.GET_SYNC_FAILED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    getSyncIsPending: false,
    getSyncErrorMessage: action.data.error,
  });

reducers[ACTIONS.SET_SYNC_STARTED] = state: unknown =>
  Object.assign({}, state, {
    setSyncIsPending: true,
    setSyncErrorMessage: null,
  });

reducers[ACTIONS.SET_SYNC_FAILED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    setSyncIsPending: false,
    setSyncErrorMessage: action.data.error,
  });

reducers[ACTIONS.SET_SYNC_COMPLETED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    setSyncIsPending: false,
    setSyncErrorMessage: null,
    hasSyncedWallet: true, // sync was successful, so the user has a synced wallet at this point
    syncHash: action.data.syncHash,
  });

reducers[ACTIONS.SYNC_APPLY_STARTED] = state: unknown =>
  Object.assign({}, state, {
    syncApplyPasswordError: false,
    syncApplyIsPending: true,
    syncApplyErrorMessage: '',
  });

reducers[ACTIONS.SYNC_APPLY_COMPLETED] = state: unknown =>
  Object.assign({}, state, {
    syncApplyIsPending: false,
    syncApplyErrorMessage: '',
  });

reducers[ACTIONS.SYNC_APPLY_FAILED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    syncApplyIsPending: false,
    syncApplyErrorMessage: action.data.error,
  });

reducers[ACTIONS.SYNC_APPLY_BAD_PASSWORD] = state: unknown =>
  Object.assign({}, state, {
    syncApplyPasswordError: true,
  });

reducers[ACTIONS.SYNC_RESET] = () => defaultState;

export function syncReducer(state = defaultState, action: unknown) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
