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

export const selectUserIsRewardEligible = createSelector(
  _selectState,
  (state) => state.user.can_claim_rewards
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

export const selectEmailNewExistingEmail = createSelector(
  _selectState,
  (state) => state.emailNewExistingEmail
)

export const selectEmailVerifyIsPending = createSelector(
  _selectState,
  (state) => state.emailVerifyIsPending
)

export const selectEmailVerifyErrorMessage = createSelector(
  _selectState,
  (state) => state.emailVerifyErrorMessage
)
