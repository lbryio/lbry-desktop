import * as types from 'constants/action_types'
import lbryuri from 'lbryuri'

const reducers = {}
const defaultState = {
}

reducers[types.RESOLVE_URI_COMPLETED] = function(state, action) {
  const {
    uri,
    claim,
  } = action.data
  const newByUri = Object.assign({}, state.byUri)

  newByUri[uri] = claim
  return Object.assign({}, state, {
    byUri: newByUri,
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
