import * as types from 'constants/action_types'

const reducers = {}
const defaultState = {
}

reducers[types.RESOLVE_URI_COMPLETED] = function(state, action) {
  const {
    uri,
    certificate,
  } = action.data
  if (!certificate) return state

  const newByUri = Object.assign({}, state.byUri)

  newByUri[uri] = certificate
  return Object.assign({}, state, {
    byUri: newByUri,
  })
}


export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
