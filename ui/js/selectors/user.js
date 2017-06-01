import { createSelector } from 'reselect'

export const _selectState = state => state.user || {}

export const selectAuthenticationIsPending = createSelector(
  _selectState,
  (state) => state.authenticationIsPending
)

export const selectAuthenticationIsFailed = createSelector(
  _selectState,
  (state) => state.user === null
)