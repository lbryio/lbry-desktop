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

reducers[types.FETCH_MY_CLAIMS_COMPLETED] = function(state, action) {
  const {
    claims,
  } = action.data
  const newMine = Object.assign({}, state.mine)
  const newById = Object.assign({}, newMine.byId)

  claims.forEach(claim => {
    newById[claim.claim_id] = claim
  })
  newMine.byId = newById

  return Object.assign({}, state, {
    mine: newMine,
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
