// @flow
import * as ACTIONS from 'constants/action_types';

const reducers = {};

const defaultState: UserState = {
  authenticationIsPending: false,
  userIsPending: false,
  emailNewIsPending: false,
  emailNewErrorMessage: '',
  emailToVerify: '',
  emailAlreadyExists: false,
  emailDoesNotExist: false,
  resendingVerificationEmail: false,
  passwordResetPending: false,
  passwordResetSuccess: false,
  passwordResetError: undefined,
  passwordSetPending: false,
  passwordSetSuccess: false,
  passwordSetError: undefined,
  inviteNewErrorMessage: '',
  inviteNewIsPending: false,
  inviteStatusIsPending: false,
  invitesRemaining: undefined,
  invitees: undefined,
  referralLink: undefined,
  referralCode: undefined,
  user: undefined,
  youtubeChannelImportPending: false,
  youtubeChannelImportErrorMessage: '',
  referrerSetIsPending: false,
  referrerSetError: '',
  odyseeMembershipName: undefined,
  odyseeMembershipsPerClaimIds: undefined,
  locale: undefined,
  homepageFetched: false,
};

reducers[ACTIONS.AUTHENTICATION_STARTED] = (state) =>
  Object.assign({}, state, {
    authenticationIsPending: true,
    userIsPending: true,
  });

reducers[ACTIONS.AUTHENTICATION_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: action.data.user,
  });

reducers[ACTIONS.AUTHENTICATION_FAILURE] = (state) =>
  Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: null,
  });

reducers[ACTIONS.USER_FETCH_STARTED] = (state) =>
  Object.assign({}, state, {
    userIsPending: true,
  });

reducers[ACTIONS.USER_FETCH_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    userIsPending: false,
    user: action.data.user,
    emailToVerify: action.data.user.has_verified_email ? null : state.emailToVerify,
  });

reducers[ACTIONS.USER_FETCH_FAILURE] = (state) =>
  Object.assign({}, state, {
    userIsPending: true,
    user: null,
  });

reducers[ACTIONS.USER_PHONE_NEW_STARTED] = (state, action) => {
  const user = Object.assign({}, state.user);
  user.country_code = action.data.country_code;
  return Object.assign({}, state, {
    phoneNewIsPending: true,
    phoneNewErrorMessage: '',
    user,
  });
};

reducers[ACTIONS.USER_PHONE_NEW_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    phoneToVerify: action.data.phone,
    phoneNewIsPending: false,
  });

reducers[ACTIONS.USER_PHONE_RESET] = (state) =>
  Object.assign({}, state, {
    phoneToVerify: null,
  });

reducers[ACTIONS.USER_PHONE_NEW_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    phoneNewIsPending: false,
    phoneNewErrorMessage: action.data.error,
  });

reducers[ACTIONS.USER_PHONE_VERIFY_STARTED] = (state) =>
  Object.assign({}, state, {
    phoneVerifyIsPending: true,
    phoneVerifyErrorMessage: '',
  });

reducers[ACTIONS.USER_PHONE_VERIFY_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    phoneToVerify: '',
    phoneVerifyIsPending: false,
    user: action.data.user,
  });

reducers[ACTIONS.USER_PHONE_VERIFY_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    phoneVerifyIsPending: false,
    phoneVerifyErrorMessage: action.data.error,
  });

reducers[ACTIONS.USER_EMAIL_NEW_STARTED] = (state) =>
  Object.assign({}, state, {
    emailNewIsPending: true,
    emailNewErrorMessage: '',
    emailAlreadyExists: false,
    emailDoesNotExist: false,
  });

reducers[ACTIONS.USER_EMAIL_NEW_SUCCESS] = (state, action) => {
  const user = Object.assign({}, state.user);
  user.primary_email = action.data.email;
  return Object.assign({}, state, {
    emailToVerify: action.data.email,
    emailNewIsPending: false,
    user,
  });
};

reducers[ACTIONS.USER_EMAIL_NEW_EXISTS] = (state) =>
  Object.assign({}, state, {
    emailAlreadyExists: true,
  });

reducers[ACTIONS.USER_EMAIL_NEW_DOES_NOT_EXIST] = (state) =>
  Object.assign({}, state, {
    emailDoesNotExist: true,
  });

reducers[ACTIONS.USER_EMAIL_NEW_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    emailNewIsPending: false,
    emailNewErrorMessage: action.data.error,
  });

reducers[ACTIONS.USER_EMAIL_NEW_CLEAR_ENTRY] = (state) => {
  const newUser = { ...state.user };
  delete newUser.primary_email;

  return Object.assign({}, state, {
    emailNewErrorMessage: null,
    emailAlreadyExists: false,
    emailDoesNotExist: false,
    passwordExistsForUser: false,
    emailToVerify: null,
    user: newUser,
  });
};

reducers[ACTIONS.USER_PASSWORD_SET_CLEAR] = (state) =>
  Object.assign({}, state, {
    passwordResetSuccess: false,
    passwordResetPending: false,
    passwordResetError: null,
    passwordSetPending: false,
    passwordSetSuccess: false,
  });

reducers[ACTIONS.USER_EMAIL_VERIFY_STARTED] = (state) =>
  Object.assign({}, state, {
    emailVerifyIsPending: true,
    emailVerifyErrorMessage: '',
  });

reducers[ACTIONS.USER_EMAIL_VERIFY_SUCCESS] = (state, action) => {
  const user = Object.assign({}, state.user);
  user.primary_email = action.data.email;
  return Object.assign({}, state, {
    emailToVerify: '',
    emailVerifyIsPending: false,
    user,
  });
};

reducers[ACTIONS.USER_EMAIL_VERIFY_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    emailVerifyIsPending: false,
    emailVerifyErrorMessage: action.data.error,
  });

reducers[ACTIONS.USER_EMAIL_VERIFY_SET] = (state, action) =>
  Object.assign({}, state, {
    emailToVerify: action.data.email,
  });

reducers[ACTIONS.USER_IDENTITY_VERIFY_STARTED] = (state) =>
  Object.assign({}, state, {
    identityVerifyIsPending: true,
    identityVerifyErrorMessage: '',
  });

reducers[ACTIONS.USER_IDENTITY_VERIFY_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    identityVerifyIsPending: false,
    identityVerifyErrorMessage: '',
    user: action.data.user,
  });

reducers[ACTIONS.USER_IDENTITY_VERIFY_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    identityVerifyIsPending: false,
    identityVerifyErrorMessage: action.data.error,
  });

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_STARTED] = (state) =>
  Object.assign({}, state, {
    inviteStatusIsPending: true,
  });

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    inviteStatusIsPending: false,
    invitesRemaining: action.data.invitesRemaining,
    invitees: action.data.invitees,
    referralLink: action.data.referralLink,
    referralCode: action.data.referralCode,
  });

reducers[ACTIONS.USER_INVITE_NEW_STARTED] = (state) =>
  Object.assign({}, state, {
    inviteNewIsPending: true,
    inviteNewErrorMessage: '',
  });

reducers[ACTIONS.USER_INVITE_NEW_SUCCESS] = (state) =>
  Object.assign({}, state, {
    inviteNewIsPending: false,
    inviteNewErrorMessage: '',
  });

reducers[ACTIONS.USER_INVITE_NEW_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    inviteNewIsPending: false,
    inviteNewErrorMessage: action.data.error.message,
  });

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_FAILURE] = (state) =>
  Object.assign({}, state, {
    inviteStatusIsPending: false,
    invitesRemaining: null,
    invitees: null,
  });

reducers[ACTIONS.USER_YOUTUBE_IMPORT_STARTED] = (state) =>
  Object.assign({}, state, {
    youtubeChannelImportPending: true,
    youtubeChannelImportErrorMessage: '',
  });

reducers[ACTIONS.USER_YOUTUBE_IMPORT_SUCCESS] = (state, action) => {
  const total = action.data.reduce((acc, value) => acc + value.total_published_videos, 0);

  const complete = action.data.reduce((acc, value) => acc + value.total_transferred, 0);

  return Object.assign({}, state, {
    youtubeChannelImportPending: false,
    youtubeChannelImportErrorMessage: '',
    youtubeChannelImportTotal: total,
    youtubeChannelImportComplete: complete,
  });
};

reducers[ACTIONS.USER_YOUTUBE_IMPORT_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    youtubeChannelImportPending: false,
    youtubeChannelImportErrorMessage: action.data,
  });

reducers[ACTIONS.USER_EMAIL_VERIFY_RETRY_STARTED] = (state) =>
  Object.assign({}, state, {
    resendingVerificationEmail: true,
  });

reducers[ACTIONS.USER_EMAIL_VERIFY_RETRY_SUCCESS] = (state) =>
  Object.assign({}, state, {
    resendingVerificationEmail: false,
  });

reducers[ACTIONS.USER_EMAIL_VERIFY_RETRY_FAILURE] = (state) =>
  Object.assign({}, state, {
    resendingVerificationEmail: false,
  });

reducers[ACTIONS.USER_SET_REFERRER_STARTED] = (state) =>
  Object.assign({}, state, {
    referrerSetIsPending: true,
    referrerSetError: defaultState.referrerSetError,
  });

reducers[ACTIONS.USER_SET_REFERRER_SUCCESS] = (state) =>
  Object.assign({}, state, {
    referrerSetIsPending: false,
    referrerSetError: defaultState.referrerSetError,
  });

reducers[ACTIONS.USER_SET_REFERRER_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    referrerSetIsPending: false,
    referrerSetError: action.data.error.message,
  });

reducers[ACTIONS.USER_SET_REFERRER_RESET] = (state) =>
  Object.assign({}, state, {
    referrerSetIsPending: false,
    referrerSetError: defaultState.referrerSetError,
  });

reducers[ACTIONS.USER_PASSWORD_EXISTS] = (state) =>
  Object.assign({}, state, {
    passwordExistsForUser: true,
  });

reducers[ACTIONS.USER_PASSWORD_RESET_STARTED] = (state) =>
  Object.assign({}, state, {
    passwordResetPending: true,
    passwordResetSuccess: defaultState.passwordResetSuccess,
    passwordResetError: null,
  });

reducers[ACTIONS.USER_PASSWORD_RESET_SUCCESS] = (state) =>
  Object.assign({}, state, {
    passwordResetPending: false,
    passwordResetSuccess: true,
  });

reducers[ACTIONS.USER_PASSWORD_RESET_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    passwordResetPending: false,
    passwordResetError: action.data.error,
  });

reducers[ACTIONS.USER_PASSWORD_SET_STARTED] = (state) =>
  Object.assign({}, state, {
    passwordSetPending: true,
    passwordSetSuccess: defaultState.passwordSetSuccess,
  });

reducers[ACTIONS.USER_PASSWORD_SET_SUCCESS] = (state) =>
  Object.assign({}, state, {
    passwordSetPending: false,
    passwordSetSuccess: true,
  });

reducers[ACTIONS.USER_PASSWORD_SET_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    passwordSetPending: false,
    passwordSetError: action.data.error,
  });

reducers[ACTIONS.USER_FETCH_LOCALE_DONE] = (state, action) =>
  Object.assign({}, state, {
    locale: action.data,
  });

reducers[ACTIONS.ADD_ODYSEE_MEMBERSHIP_DATA] = (state, action) => {
  return Object.assign({}, state, {
    odyseeMembershipName: action.data.odyseeMembershipName,
  });
};

reducers[ACTIONS.ADD_CLAIMIDS_MEMBERSHIP_DATA] = (state, action) => {
  let latestData = {};

  // add additional user membership value
  if (state.odyseeMembershipsPerClaimIds) {
    latestData = Object.assign({}, state.odyseeMembershipsPerClaimIds, action.data.response);
  } else {
    // otherwise just send the current data because nothing is saved yet
    latestData = action.data.response;
  }

  return Object.assign({}, state, {
    odyseeMembershipsPerClaimIds: latestData,
  });
};

reducers[ACTIONS.FETCH_HOMEPAGES_DONE] = (state) =>
  Object.assign({}, state, {
    homepageFetched: true,
  });

export default function userReducer(state: UserState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
