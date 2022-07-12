import { createSelector } from 'reselect';

const selectState = (state) => state.lbrysync || {};

export const selectLbrySyncRegistering = createSelector(selectState, (state) => state.registering);

export const selectLbrySyncEmail = createSelector(selectState, (state) => state.registeredEmail);

export const selectLbrySyncRegisterError = createSelector(selectState, (state) => state.registerError);

// probably shouldn't store this here.
export const selectLbrySyncToken = createSelector(selectState, (state) => state.registering);

export const selectLbrySyncIsAuthenticating = createSelector(selectState, (state) => state.isAuthenticating);

export const selectLbrySyncAuthError = createSelector(selectState, (state) => state.authError);
