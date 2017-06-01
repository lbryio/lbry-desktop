import * as types from 'constants/action_types'

const reducers = {}

const defaultState = {
  authenticationIsPending: false,
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

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
