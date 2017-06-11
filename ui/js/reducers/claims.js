import * as types from "constants/action_types";
import lbryuri from "lbryuri";

const reducers = {};
const defaultState = {};

reducers[types.RESOLVE_URI_COMPLETED] = function(state, action) {
  const { uri, certificate, claim } = action.data;

  const byUri = Object.assign({}, state.claimsByUri);
  const byId = Object.assign({}, state.byId);

  if (claim) {
    byId[claim.claim_id] = claim;
    byUri[uri] = claim.claim_id;
  } else if (claim === undefined && certificate !== undefined) {
    byId[certificate.claim_id] = certificate;
    byUri[uri] = certificate.claim_id;
  } else {
    byUri[uri] = null;
  }

  return Object.assign({}, state, {
    byId,
    claimsByUri: byUri,
  });
};

reducers[types.FETCH_CLAIM_LIST_MINE_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    isClaimListMinePending: true,
  });
};

reducers[types.FETCH_CLAIM_LIST_MINE_COMPLETED] = function(state, action) {
  const { claims } = action.data;
  const myClaims = new Set(state.myClaims);
  const byUri = Object.assign({}, state.claimsByUri);
  const byId = Object.assign({}, state.byId);

  claims.forEach(claim => {
    myClaims.add(claim.claim_id);
    byId[claim.claim_id] = claim;
  });

  return Object.assign({}, state, {
    isClaimListMinePending: false,
    myClaims: myClaims,
    byId,
  });
};

reducers[types.FETCH_CHANNEL_LIST_MINE_STARTED] = function(state, action) {
  return Object.assign({}, state, { fetchingMyChannels: true });
};

reducers[types.FETCH_CHANNEL_LIST_MINE_COMPLETED] = function(state, action) {
  const { claims } = action.data;
  const myChannelClaims = new Set(state.myChannelClaims);
  const byId = Object.assign({}, state.byId);

  claims.forEach(claim => {
    myChannelClaims.add(claim.claim_id);
    byId[claims.claim_id] = claim;
  });

  return Object.assign({}, state, {
    byId,
    fetchingMyChannels: false,
    myChannelClaims,
  });
};

reducers[types.FETCH_CHANNEL_CLAIMS_COMPLETED] = function(state, action) {
  const { uri, claims } = action.data;

  const newClaims = Object.assign({}, state.claimsByChannel);

  if (claims !== undefined) {
    newClaims[uri] = claims;
  }

  return Object.assign({}, state, {
    claimsByChannel: newClaims,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
