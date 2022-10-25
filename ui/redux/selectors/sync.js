import { createSelector } from 'reselect';

const selectState = (state) => state.sync || {};

export const selectHasSyncedWallet = createSelector(selectState, (state) => state.hasSyncedWallet);

export const selectSyncHash = createSelector(selectState, (state) => state.syncHash);

export const selectSyncData = createSelector(selectState, (state) => state.syncData);

export const selectSetSyncErrorMessage = createSelector(selectState, (state) => state.setSyncErrorMessage);

export const selectGetSyncErrorMessage = createSelector(selectState, (state) => state.getSyncErrorMessage);

export const selectGetSyncIsPending = createSelector(selectState, (state) => state.getSyncIsPending);

export const selectSetSyncIsPending = createSelector(selectState, (state) => state.setSyncIsPending);

export const selectHashChanged = createSelector(selectState, (state) => state.hashChanged);

export const selectSyncApplyIsPending = createSelector(selectState, (state) => state.syncApplyIsPending);

export const selectSyncApplyErrorMessage = createSelector(selectState, (state) => state.syncApplyErrorMessage);

export const selectSyncApplyPasswordError = createSelector(selectState, (state) => state.syncApplyPasswordError);

export const selectSyncIsLocked = createSelector(selectState, (state) => state.syncLocked);

export const selectPrefsReady = createSelector(selectState, (state) => state.prefsReady);

export const selectSyncFatalError = createSelector(selectState, (state) => state.fatalError);
// lbrysync

// begin
export const selectLbrySyncCheckingEmail = createSelector(selectState, (state) => state.checkingEmail);
export const selectLbrySyncEmailError = createSelector(selectState, (state) => state.emailError);
export const selectLbrySyncEmail = createSelector(selectState, (state) => state.registeredEmail);
export const selectLbrySyncEmailCandidate = createSelector(selectState, (state) => state.candidateEmail);
export const selectLbrySyncGettingSalt = createSelector(selectState, (state) => state.gettingSalt);
export const selectLbrySyncSaltError = createSelector(selectState, (state) => state.saltError);
export const selectLbrySyncSaltSeed = createSelector(selectState, (state) => state.saltSeed);
// password
export const selectLbrySyncDerivingKeys = createSelector(selectState, (state) => state.derivingKeys);
export const selectLbrySyncEncryptedHmacKey = createSelector(selectState, (state) => state.encryptedHmacKey);
export const selectLbrySyncEncryptedRoot = createSelector(selectState, (state) => state.encryptedRoot);
export const selectLbrySyncEncryptedProviderPass = createSelector(selectState, (state) => state.encryptedProviderPass);
// register
export const selectLbrySyncRegistering = createSelector(selectState, (state) => state.registering);
export const selectLbrySyncRegisterError = createSelector(selectState, (state) => state.registerError);
// auth
export const selectLbrySyncIsAuthenticating = createSelector(selectState, (state) => state.isAuthenticating);

export const selectLbrySyncAuthError = createSelector(selectState, (state) => state.authError);

export const selectLbrySyncToken = createSelector(selectState, (state) => state.authToken);
// push/pull?
