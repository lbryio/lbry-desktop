import * as ACTIONS from 'constants/action_types';

const reducers = {};

const defaultState = {
  authenticationIsPending: false,
  userIsPending: false,
  emailNewIsPending: false,
  emailNewErrorMessage: '',
  emailToVerify: '',
  inviteNewErrorMessage: '',
  inviteNewIsPending: false,
  inviteStatusIsPending: false,
  invitesRemaining: undefined,
  invitees: undefined,
  user: undefined,
};

reducers[ACTIONS.AUTHENTICATION_STARTED] = state =>
  Object.assign({}, state, {
    authenticationIsPending: true,
    userIsPending: true,
    user: defaultState.user,
  });

reducers[ACTIONS.AUTHENTICATION_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: action.data.user,
  });

reducers[ACTIONS.AUTHENTICATION_FAILURE] = state =>
  Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: null,
  });

reducers[ACTIONS.USER_FETCH_STARTED] = state =>
  Object.assign({}, state, {
    userIsPending: true,
    user: defaultState.user,
  });

reducers[ACTIONS.USER_FETCH_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    userIsPending: false,
    user: action.data.user,
  });

reducers[ACTIONS.USER_FETCH_FAILURE] = state =>
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

reducers[ACTIONS.USER_PHONE_RESET] = state =>
  Object.assign({}, state, {
    phoneToVerify: null,
  });

reducers[ACTIONS.USER_PHONE_NEW_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    phoneNewIsPending: false,
    phoneNewErrorMessage: action.data.error,
  });

reducers[ACTIONS.USER_PHONE_VERIFY_STARTED] = state =>
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

reducers[ACTIONS.USER_EMAIL_NEW_STARTED] = state =>
  Object.assign({}, state, {
    emailNewIsPending: true,
    emailNewErrorMessage: '',
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

reducers[ACTIONS.USER_EMAIL_NEW_EXISTS] = (state, action) =>
  Object.assign({}, state, {
    emailToVerify: action.data.email,
    emailNewIsPending: false,
  });

reducers[ACTIONS.USER_EMAIL_NEW_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    emailNewIsPending: false,
    emailNewErrorMessage: action.data.error,
  });

reducers[ACTIONS.USER_EMAIL_VERIFY_STARTED] = state =>
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

reducers[ACTIONS.USER_IDENTITY_VERIFY_STARTED] = state =>
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

reducers[ACTIONS.FETCH_ACCESS_TOKEN_SUCCESS] = (state, action) => {
  const { token } = action.data;

  return Object.assign({}, state, {
    accessToken: token,
  });
};

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_STARTED] = state =>
  Object.assign({}, state, {
    inviteStatusIsPending: true,
  });

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    inviteStatusIsPending: false,
    invitesRemaining: action.data.invitesRemaining,
    invitees: action.data.invitees,
  });

reducers[ACTIONS.USER_INVITE_NEW_STARTED] = state =>
  Object.assign({}, state, {
    inviteNewIsPending: true,
    inviteNewErrorMessage: '',
  });

reducers[ACTIONS.USER_INVITE_NEW_SUCCESS] = state =>
  Object.assign({}, state, {
    inviteNewIsPending: false,
    inviteNewErrorMessage: '',
  });

reducers[ACTIONS.USER_INVITE_NEW_FAILURE] = (state, action) =>
  Object.assign({}, state, {
    inviteNewIsPending: false,
    inviteNewErrorMessage: action.data.error.message,
  });

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_FAILURE] = state =>
  Object.assign({}, state, {
    inviteStatusIsPending: false,
    invitesRemaining: null,
    invitees: null,
  });

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
