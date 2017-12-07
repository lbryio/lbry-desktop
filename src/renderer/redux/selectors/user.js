import { createSelector } from "reselect";

export const _selectState = state => state.user || {};

export const selectAuthenticationIsPending = createSelector(
  _selectState,
  state => state.authenticationIsPending
);

export const selectUserIsPending = createSelector(
  _selectState,
  state => state.userIsPending
);

export const selectUser = createSelector(_selectState, state => state.user);

export const selectUserEmail = createSelector(
  selectUser,
  user => (user ? user.primary_email : null)
);

export const selectEmailToVerify = createSelector(
  _selectState,
  selectUserEmail,
  (state, userEmail) => state.emailToVerify || userEmail
);

export const selectUserIsRewardApproved = createSelector(
  selectUser,
  user => user && user.is_reward_approved
);

export const selectEmailNewIsPending = createSelector(
  _selectState,
  state => state.emailNewIsPending
);

export const selectEmailNewErrorMessage = createSelector(
  _selectState,
  state => state.emailNewErrorMessage
);

export const selectEmailVerifyIsPending = createSelector(
  _selectState,
  state => state.emailVerifyIsPending
);

export const selectEmailVerifyErrorMessage = createSelector(
  _selectState,
  state => state.emailVerifyErrorMessage
);

export const selectIdentityVerifyIsPending = createSelector(
  _selectState,
  state => state.identityVerifyIsPending
);

export const selectIdentityVerifyErrorMessage = createSelector(
  _selectState,
  state => state.identityVerifyErrorMessage
);

export const selectUserIsVerificationCandidate = createSelector(
  selectUser,
  user => user && (!user.has_verified_email || !user.is_identity_verified)
);

export const selectAccessToken = createSelector(
  _selectState,
  state => state.accessToken
);

export const selectUserInviteStatusIsPending = createSelector(
  _selectState,
  state => state.inviteStatusIsPending
);

export const selectUserInvitesRemaining = createSelector(
  _selectState,
  state => state.invitesRemaining
);

export const selectUserInvitees = createSelector(
  _selectState,
  state => state.invitees
);

export const selectUserInviteStatusFailed = createSelector(
  selectUserInvitesRemaining,
  inviteStatus => selectUserInvitesRemaining === null
);

export const selectUserInviteNewIsPending = createSelector(
  _selectState,
  state => state.inviteNewIsPending
);

export const selectUserInviteNewErrorMessage = createSelector(
  _selectState,
  state => state.inviteNewErrorMessage
);
