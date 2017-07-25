import * as types from "constants/action_types";
import { getLocal } from "utils";

const reducers = {};

const defaultState = {
  authenticationIsPending: false,
  userIsPending: false,
  emailNewIsPending: false,
  emailNewErrorMessage: "",
  emailNewDeclined: getLocal("user_email_declined", false),
  emailToVerify: "",
  user: undefined,
};

reducers[types.AUTHENTICATION_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    authenticationIsPending: true,
    userIsPending: true,
    user: defaultState.user,
  });
};

reducers[types.AUTHENTICATION_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: action.data.user,
  });
};

reducers[types.AUTHENTICATION_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: null,
  });
};

reducers[types.USER_FETCH_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    userIsPending: true,
    user: defaultState.user,
  });
};

reducers[types.USER_FETCH_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    userIsPending: false,
    user: action.data.user,
  });
};

reducers[types.USER_FETCH_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    userIsPending: true,
    user: null,
  });
};

reducers[types.USER_EMAIL_DECLINE] = function(state, action) {
  return Object.assign({}, state, {
    emailNewDeclined: true,
  });
};

reducers[types.USER_EMAIL_NEW_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    emailNewIsPending: true,
    emailNewErrorMessage: "",
  });
};

reducers[types.USER_EMAIL_NEW_SUCCESS] = function(state, action) {
  let user = Object.assign({}, state.user);
  user.primary_email = action.data.email;
  return Object.assign({}, state, {
    emailToVerify: action.data.email,
    emailNewIsPending: false,
    user: user,
  });
};

reducers[types.USER_EMAIL_NEW_EXISTS] = function(state, action) {
  let user = Object.assign({}, state.user);
  return Object.assign({}, state, {
    emailToVerify: action.data.email,
    emailNewIsPending: false,
  });
};

reducers[types.USER_EMAIL_NEW_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    emailNewIsPending: false,
    emailNewErrorMessage: action.data.error,
  });
};

reducers[types.USER_EMAIL_VERIFY_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    emailVerifyIsPending: true,
    emailVerifyErrorMessage: "",
  });
};

reducers[types.USER_EMAIL_VERIFY_SUCCESS] = function(state, action) {
  let user = Object.assign({}, state.user);
  user.primary_email = action.data.email;
  return Object.assign({}, state, {
    emailToVerify: "",
    emailVerifyIsPending: false,
    user: user,
  });
};

reducers[types.USER_EMAIL_VERIFY_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    emailVerifyIsPending: false,
    emailVerifyErrorMessage: action.data.error,
  });
};

reducers[types.USER_IDENTITY_VERIFY_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    identityVerifyIsPending: true,
    identityVerifyErrorMessage: "",
  });
};

reducers[types.USER_IDENTITY_VERIFY_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    identityVerifyIsPending: false,
    identityVerifyErrorMessage: "",
    user: action.data.user,
  });
};

reducers[types.USER_IDENTITY_VERIFY_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    identityVerifyIsPending: false,
    identityVerifyErrorMessage: action.data.error,
  });
};

reducers[types.FETCH_ACCESS_TOKEN_SUCCESS] = function(state, action) {
  const { token } = action.data;

  return Object.assign({}, state, {
    accessToken: token,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
