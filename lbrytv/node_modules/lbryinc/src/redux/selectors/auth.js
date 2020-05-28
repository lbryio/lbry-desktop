import { createSelector } from 'reselect';

const selectState = state => state.auth || {};

export const selectAuthToken = createSelector(selectState, state => state.authToken);

export const selectIsAuthenticating = createSelector(selectState, state => state.authenticating);
