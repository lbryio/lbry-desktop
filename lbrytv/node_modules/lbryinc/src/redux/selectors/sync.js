import { createSelector } from 'reselect';

const selectState = state => state.sync || {};

export const selectHasSyncedWallet = createSelector(selectState, state => state.hasSyncedWallet);

export const selectSyncHash = createSelector(selectState, state => state.syncHash);

export const selectSyncData = createSelector(selectState, state => state.syncData);

export const selectSetSyncErrorMessage = createSelector(
  selectState,
  state => state.setSyncErrorMessage
);

export const selectGetSyncErrorMessage = createSelector(
  selectState,
  state => state.getSyncErrorMessage
);

export const selectGetSyncIsPending = createSelector(selectState, state => state.getSyncIsPending);

export const selectSetSyncIsPending = createSelector(selectState, state => state.setSyncIsPending);

export const selectHashChanged = createSelector(selectState, state => state.hashChanged);

export const selectSyncApplyIsPending = createSelector(
  selectState,
  state => state.syncApplyIsPending
);

export const selectSyncApplyErrorMessage = createSelector(
  selectState,
  state => state.syncApplyErrorMessage
);

export const selectSyncApplyPasswordError = createSelector(
  selectState,
  state => state.syncApplyPasswordError
);
