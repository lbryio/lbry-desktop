const selectState = (state) => state.sync || {};

export const selectHasSyncedWallet = (state) => selectState(state).hasSyncedWallet;
export const selectSyncHash = (state) => selectState(state).syncHash;
export const selectSyncData = (state) => selectState(state).syncData;
export const selectSetSyncErrorMessage = (state) => selectState(state).setSyncErrorMessage;
export const selectGetSyncErrorMessage = (state) => selectState(state).getSyncErrorMessage;
export const selectGetSyncIsPending = (state) => selectState(state).getSyncIsPending;
export const selectSetSyncIsPending = (state) => selectState(state).setSyncIsPending;
export const selectHashChanged = (state) => selectState(state).hashChanged;
export const selectSyncApplyIsPending = (state) => selectState(state).syncApplyIsPending;
export const selectSyncApplyErrorMessage = (state) => selectState(state).syncApplyErrorMessage;
export const selectSyncApplyPasswordError = (state) => selectState(state).syncApplyPasswordError;
export const selectSyncIsLocked = (state) => selectState(state).syncLocked;
export const selectPrefsReady = (state) => selectState(state).prefsReady;
export const selectSyncFatalError = (state) => selectState(state).fatalError;
