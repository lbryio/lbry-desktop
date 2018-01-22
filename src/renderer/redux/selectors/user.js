import { createSelector } from 'reselect';

export const selectState = state => state.user || {};

export const selectAuthenticationIsPending = createSelector(
  selectState,
  state => state.authenticationIsPending
);

export const selectUserIsPending = createSelector(selectState, state => state.userIsPending);

export const selectUser = createSelector(selectState, state => state.user);

export const selectUserEmail = createSelector(
  selectUser,
  user => (user ? user.primary_email : null)
);

export const selectUserPhone = createSelector(
  selectUser,
  user => (user ? user.phone_number : null)
);

export const selectUserCountryCode = createSelector(
  selectUser,
  user => (user ? user.country_code : null)
);

export const selectEmailToVerify = createSelector(
  selectState,
  selectUserEmail,
  (state, userEmail) => state.emailToVerify || userEmail
);

export const selectPhoneToVerify = createSelector(
  selectState,
  selectUserPhone,
  (state, userPhone) => state.phoneToVerify || userPhone
);

export const selectUserIsRewardApproved = createSelector(
  selectUser,
  user => user && user.is_reward_approved
);

export const selectEmailNewIsPending = createSelector(
  selectState,
  state => state.emailNewIsPending
);

export const selectEmailNewErrorMessage = createSelector(
  selectState,
  state => state.emailNewErrorMessage
);

export const selectPhoneNewErrorMessage = createSelector(
  selectState,
  state => state.phoneNewErrorMessage
);

export const selectEmailVerifyIsPending = createSelector(
  selectState,
  state => state.emailVerifyIsPending
);

export const selectEmailVerifyErrorMessage = createSelector(
  selectState,
  state => state.emailVerifyErrorMessage
);

export const selectPhoneVerifyErrorMessage = createSelector(
  selectState,
  state => state.phoneVerifyErrorMessage
);

export const selectIdentityVerifyIsPending = createSelector(
  selectState,
  state => state.identityVerifyIsPending
);

export const selectIdentityVerifyErrorMessage = createSelector(
  selectState,
  state => state.identityVerifyErrorMessage
);

export const selectUserIsVerificationCandidate = createSelector(
  selectUser,
  user => user && (!user.has_verified_email || !user.is_identity_verified)
);

export const selectAccessToken = createSelector(selectState, state => state.accessToken);

export const selectUserInviteStatusIsPending = createSelector(
  selectState,
  state => state.inviteStatusIsPending
);

export const selectUserInvitesRemaining = createSelector(
  selectState,
  state => state.invitesRemaining
);

export const selectUserInvitees = createSelector(selectState, state => state.invitees);

export const selectUserInviteStatusFailed = createSelector(
  selectUserInvitesRemaining,
  () => selectUserInvitesRemaining === null
);

export const selectUserInviteNewIsPending = createSelector(
  selectState,
  state => state.inviteNewIsPending
);

export const selectUserInviteNewErrorMessage = createSelector(
  selectState,
  state => state.inviteNewErrorMessage
);
