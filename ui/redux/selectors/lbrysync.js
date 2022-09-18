import { createSelector } from 'reselect';

const selectState = (state) => state.lbrysync || {};

export const selectLbrySyncRegistering = createSelector(selectState, (state) => state.registering);
export const selectLbrySyncEmail = createSelector(selectState, (state) => state.registeredEmail);
export const selectLbrySyncRegisterError = createSelector(selectState, (state) => state.registerError);

export const selectLbrySyncGettingSalt = createSelector(selectState, (state) => state.gettingSalt);
export const selectLbrySyncSaltError = createSelector(selectState, (state) => state.saltError);
export const selectLbrySyncSaltSeed = createSelector(selectState, (state) => state.saltSeed);

export const selectLbrySyncIsAuthenticating = createSelector(selectState, (state) => state.isAuthenticating);

export const selectLbrySyncAuthError = createSelector(selectState, (state) => state.authError);
export const selectLbrySyncToken = createSelector(selectState, (state) => state.authToken);

export const selectLbrySyncDerivingKeys = createSelector(selectState, (state) => state.derivingKeys);
export const selectLbrySyncEncryptedHmacKey = createSelector(selectState, (state) => state.encryptedHmacKey);
export const selectLbrySyncEncryptedRoot = createSelector(selectState, (state) => state.encryptedRoot);
export const selectLbrySyncEncryptedProviderPass = createSelector(selectState, (state) => state.encryptedProviderPass);
