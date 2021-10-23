const selectState = (state) => state.auth || {};

export const selectAuthToken = (state) => selectState(state).authToken;
export const selectIsAuthenticating = (state) => selectState(state).authenticating;
