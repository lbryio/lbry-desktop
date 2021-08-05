import { createSelector } from 'reselect';

export const selectState = (state) => state.user || {};

export const selectAuthenticationIsPending = createSelector(selectState, (state) => state.authenticationIsPending);

export const selectUserIsPending = createSelector(selectState, (state) => state.userIsPending);

export const selectUser = createSelector(selectState, (state) => state.user);

export const selectEmailAlreadyExists = createSelector(selectState, (state) => state.emailAlreadyExists);

export const selectEmailDoesNotExist = createSelector(selectState, (state) => state.emailDoesNotExist);

export const selectResendingVerificationEmail = createSelector(
  selectState,
  (state) => state.resendingVerificationEmail
);

export const selectUserEmail = createSelector(selectUser, (user) =>
  user ? user.primary_email || user.latest_claimed_email : null
);

export const selectUserPhone = createSelector(selectUser, (user) => (user ? user.phone_number : null));

export const selectUserCountryCode = createSelector(selectUser, (user) => (user ? user.country_code : null));

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

export const selectYoutubeChannels = createSelector(selectUser, (user) => (user ? user.youtube_channels : null));

export const selectUserIsRewardApproved = createSelector(selectUser, (user) => user && user.is_reward_approved);

export const selectEmailNewIsPending = createSelector(selectState, (state) => state.emailNewIsPending);

export const selectEmailNewErrorMessage = createSelector(selectState, (state) => {
  const error = state.emailNewErrorMessage;
  return typeof error === 'object' && error !== null ? error.message : error;
});

export const selectPasswordExists = createSelector(selectState, (state) => state.passwordExistsForUser);

export const selectPasswordResetIsPending = createSelector(selectState, (state) => state.passwordResetPending);

export const selectPasswordResetSuccess = createSelector(selectState, (state) => state.passwordResetSuccess);

export const selectPasswordResetError = createSelector(selectState, (state) => {
  const error = state.passwordResetError;
  return typeof error === 'object' && error !== null ? error.message : error;
});

export const selectPasswordSetIsPending = createSelector(selectState, (state) => state.passwordSetPending);

export const selectPasswordSetSuccess = createSelector(selectState, (state) => state.passwordSetSuccess);

export const selectPasswordSetError = createSelector(selectState, (state) => {
  const error = state.passwordSetError;
  return typeof error === 'object' && error !== null ? error.message : error;
});

export const selectPhoneNewErrorMessage = createSelector(selectState, (state) => state.phoneNewErrorMessage);

export const selectEmailVerifyIsPending = createSelector(selectState, (state) => state.emailVerifyIsPending);

export const selectEmailVerifyErrorMessage = createSelector(selectState, (state) => state.emailVerifyErrorMessage);

export const selectPhoneNewIsPending = createSelector(selectState, (state) => state.phoneNewIsPending);

export const selectPhoneVerifyIsPending = createSelector(selectState, (state) => state.phoneVerifyIsPending);

export const selectPhoneVerifyErrorMessage = createSelector(selectState, (state) => state.phoneVerifyErrorMessage);

export const selectIdentityVerifyIsPending = createSelector(selectState, (state) => state.identityVerifyIsPending);

export const selectIdentityVerifyErrorMessage = createSelector(
  selectState,
  (state) => state.identityVerifyErrorMessage
);

export const selectUserVerifiedEmail = createSelector(selectUser, (user) => user && user.has_verified_email);

export const selectUserIsVerificationCandidate = createSelector(
  selectUser,
  (user) => user && (!user.has_verified_email || !user.is_identity_verified)
);

export const selectAccessToken = createSelector(selectState, (state) => state.accessToken);

export const selectUserInviteStatusIsPending = createSelector(selectState, (state) => state.inviteStatusIsPending);

export const selectUserInvitesRemaining = createSelector(selectState, (state) => state.invitesRemaining);

export const selectUserInvitees = createSelector(selectState, (state) => state.invitees);

export const selectUserInviteStatusFailed = createSelector(
  selectUserInvitesRemaining,
  () => selectUserInvitesRemaining === null
);

export const selectUserInviteNewIsPending = createSelector(selectState, (state) => state.inviteNewIsPending);

export const selectUserInviteNewErrorMessage = createSelector(selectState, (state) => state.inviteNewErrorMessage);

export const selectUserInviteReferralLink = createSelector(selectState, (state) => state.referralLink);

export const selectUserInviteReferralCode = createSelector(selectState, (state) =>
  state.referralCode ? state.referralCode[0] : ''
);

export const selectYouTubeImportPending = createSelector(selectState, (state) => state.youtubeChannelImportPending);

export const selectYouTubeImportError = createSelector(selectState, (state) => state.youtubeChannelImportErrorMessage);

export const selectSetReferrerPending = createSelector(selectState, (state) => state.referrerSetIsPending);

export const selectSetReferrerError = createSelector(selectState, (state) => state.referrerSetError);

export const selectYouTubeImportVideosComplete = createSelector(selectState, (state) => {
  const total = state.youtubeChannelImportTotal;
  const complete = state.youtubeChannelImportComplete || 0;

  if (total) {
    return [complete, total];
  }
});

export const makeSelectUserPropForProp = (prop) => createSelector(selectUser, (user) => (user ? user[prop] : null));
