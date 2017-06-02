import * as types from 'constants/action_types'
import {
  getLocal
} from 'utils'

const reducers = {}

const defaultState = {
  authenticationIsPending: false,
  emailNewIsPending: false,
  emailNewErrorMessage: '',
  emailNewDeclined: getLocal('user_email_declined', false),
  user: undefined
}

reducers[types.AUTHENTICATION_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    authenticationIsPending: true
  })
}

reducers[types.AUTHENTICATION_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    authenticationIsPending: false,
    user: action.data.user,
  })
}

reducers[types.AUTHENTICATION_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    authenticationIsPending: false,
    user: null,
  })
}

reducers[types.USER_EMAIL_DECLINE] = function(state, action) {
  return Object.assign({}, state, {
    emailNewDeclined: true
  })
}

reducers[types.USER_EMAIL_NEW_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    emailNewIsPending: true,
    emailNewErrorMessage: ''
  })
}

reducers[types.USER_EMAIL_NEW_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    emailNewIsPending: false,
  })
}

reducers[types.USER_EMAIL_NEW_EXISTS] = function(state, action) {
  return Object.assign({}, state, {
    emailNewExistingEmail: action.data.email,
    emailNewIsPending: false,
  })
}

reducers[types.USER_EMAIL_NEW_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    emailNewIsPending: false,
    emailNewErrorMessage: action.data.error
  })
}

reducers[types.USER_EMAIL_VERIFY_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    emailVerifyIsPending: true,
    emailVerifyErrorMessage: ''
  })
}

reducers[types.USER_EMAIL_VERIFY_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    emailVerifyIsPending: false,
  })
}

reducers[types.USER_EMAIL_VERIFY_FAILURE] = function(state, action) {
  return Object.assign({}, state, {
    emailVerifyIsPending: false,
    emailVerifyErrorMessage: action.data.error
  })
}


export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
