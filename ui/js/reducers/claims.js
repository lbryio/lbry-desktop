import * as types from 'constants/action_types'
import lbryuri from 'lbryuri'

const reducers = {}
const defaultState = {
}

reducers[types.RESOLVE_URI_COMPLETED] = function(state, action) {
  const {
    uri,
    certificate,
    claim,
  } = action.data

  const newClaims = Object.assign({}, state.claimsByUri)

  newClaims[uri] = claim

  //This needs a sanity boost...
  if (certificate !== undefined && claim === undefined) {
    const uriParts = lbryuri.parse(uri);
    // newChannelClaims[uri] = certificate
    if (claim === undefined) {
      newClaims[uri] = certificate
    }
  }

  return Object.assign({}, state, {
    claimsByUri: newClaims
  })
}

reducers[types.RESOLVE_URI_CANCELED] = function(state, action) {
  const uri = action.data.uri
  const newClaims = Object.assign({}, state.claimsByUri)
  delete newClaims[uri]
  return Object.assign({}, state, {
    claimsByUri: newClaims
  })
}

reducers[types.FETCH_CHANNEL_CLAIMS_COMPLETED] = function(state, action) {
  const {
    uri,
    claims
  } = action.data

  const newClaims = Object.assign({}, state.claimsByChannel)

  if (claims !== undefined) {
    newClaims[uri] = claims
  }

  return Object.assign({}, state, {
    claimsByChannel: newClaims
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
