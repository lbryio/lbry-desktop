import { createSelector } from 'reselect'

export const _selectState = state => state.user || {}

export const selectAuthenticationIsPending = createSelector(
  _selectState,
  (state) => state.authenticationIsPending
)

export const selectUser = createSelector(
  _selectState,
  (state) => state.user
)

export const selectEmailNewIsPending = createSelector(
  _selectState,
  (state) => state.emailNewIsPending
)

export const selectEmailNewErrorMessage = createSelector(
  _selectState,
  (state) => state.emailNewErrorMessage
)

export const selectEmailNewDeclined = createSelector(
  _selectState,
  (state) => state.emailNewDeclined
)