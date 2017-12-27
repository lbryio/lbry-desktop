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

reducers[ACTIONS.AUTHENTICATION_STARTED] = function(state) {
  return Object.assign({}, state, {
    authenticationIsPending: true,
    userIsPending: true,
    user: defaultState.user,
  });
};

reducers[ACTIONS.AUTHENTICATION_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: action.data.user,
  });
};

reducers[ACTIONS.AUTHENTICATION_FAILURE] = function(state) {
  return Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: null,
  });
};

reducers[ACTIONS.USER_FETCH_STARTED] = function(state) {
  return Object.assign({}, state, {
    userIsPending: true,
    user: defaultState.user,
  });
};

reducers[ACTIONS.USER_FETCH_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    userIsPending: false,
    user: action.data.user,
  });
};

reducers[ACTIONS.USER_FETCH_FAILURE] = function(state) {
  return Object.assign({}, state, {
    userIsPending: true,
    user: null,
  });
};

reducers[ACTIONS.USER_EMAIL_NEW_STARTED] = function(state) {
  return Object.assign({}, state, {
    emailNewIsPending: true,
    emailNewErrorMessage: '',
  });
};

reducers[ACTIONS.USER_EMAIL_NEW_SUCCESS] = function(state, action) {
  const user = Object.assign({}, state.user);
  user.primary_email = action.data.email;
  return Object.assign({}, state, {
    emailToVerify: action.data.email,
    emailNewIsPending: false,
    user,
  });
};

reducers[ACTIONS.USER_EMAIL_NEW_EXISTS] = function(state, action) {
  return Object.assign({}, state, {
    emailToVerify: action.data.email,
    emailNewIsPending: false,
  });
};

reducers[ACTIONS.USER_EMAIL_NEW_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    emailNewIsPending: false,
    emailNewErrorMessage: action.data.error,
  });
};

reducers[ACTIONS.USER_EMAIL_VERIFY_STARTED] = function(state) {
  return Object.assign({}, state, {
    emailVerifyIsPending: true,
    emailVerifyErrorMessage: '',
  });
};

reducers[ACTIONS.USER_EMAIL_VERIFY_SUCCESS] = function(state, action) {
  const user = Object.assign({}, state.user);
  user.primary_email = action.data.email;
  return Object.assign({}, state, {
    emailToVerify: '',
    emailVerifyIsPending: false,
    user,
  });
};

reducers[ACTIONS.USER_EMAIL_VERIFY_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    emailVerifyIsPending: false,
    emailVerifyErrorMessage: action.data.error,
  });
};

reducers[ACTIONS.USER_IDENTITY_VERIFY_STARTED] = function(state) {
  return Object.assign({}, state, {
    identityVerifyIsPending: true,
    identityVerifyErrorMessage: '',
  });
};

reducers[ACTIONS.USER_IDENTITY_VERIFY_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    identityVerifyIsPending: false,
    identityVerifyErrorMessage: '',
    user: action.data.user,
  });
};

reducers[ACTIONS.USER_IDENTITY_VERIFY_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    identityVerifyIsPending: false,
    identityVerifyErrorMessage: action.data.error,
  });
};

reducers[ACTIONS.FETCH_ACCESS_TOKEN_SUCCESS] = function(state, action) {
  const { token } = action.data;

  return Object.assign({}, state, {
    accessToken: token,
  });
};

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_STARTED] = function(state) {
  return Object.assign({}, state, {
    inviteStatusIsPending: true,
  });
};

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    inviteStatusIsPending: false,
    invitesRemaining: action.data.invitesRemaining,
    invitees: action.data.invitees,
  });
};

reducers[ACTIONS.USER_INVITE_NEW_STARTED] = function(state) {
  return Object.assign({}, state, {
    inviteNewIsPending: true,
    inviteNewErrorMessage: '',
  });
};

reducers[ACTIONS.USER_INVITE_NEW_SUCCESS] = function(state) {
  return Object.assign({}, state, {
    inviteNewIsPending: false,
    inviteNewErrorMessage: '',
  });
};

reducers[ACTIONS.USER_INVITE_NEW_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    inviteNewIsPending: false,
    inviteNewErrorMessage: action.data.error.message,
  });
};

reducers[ACTIONS.USER_INVITE_STATUS_FETCH_FAILURE] = function(state) {
  return Object.assign({}, state, {
    inviteStatusIsPending: false,
    invitesRemaining: null,
    invitees: null,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
