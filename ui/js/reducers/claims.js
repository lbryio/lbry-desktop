import * as types from "constants/action_types";
import lbryuri from "lbryuri";

const reducers = {};
const buildClaimSupport = () => ({
  name: undefined,
  amount: undefined,
  claim_id: undefined,
});
const defaultState = {
  claimSupport: buildClaimSupport(),
};

reducers[types.RESOLVE_URI_COMPLETED] = function(state, action) {
  const { uri, certificate, claim } = action.data;

  const byUri = Object.assign({}, state.claimsByUri);
  const byId = Object.assign({}, state.byId);

  if (claim) {
    byId[claim.claim_id] = claim;
    byUri[uri] = claim.claim_id;
  } else if (claim === undefined && certificate !== undefined) {
    byId[certificate.claim_id] = certificate;
    // Don't point URI at the channel certificate unless it actually is
    // a channel URI. This is brittle.
    if (!uri.split(certificate.name)[1].match(/\//)) {
      byUri[uri] = certificate.claim_id;
    } else {
      byUri[uri] = null;
    }
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
    isFetchingClaimListMine: true,
  });
};

reducers[types.FETCH_CLAIM_LIST_MINE_COMPLETED] = function(state, action) {
  const { claims } = action.data;
  const byUri = Object.assign({}, state.claimsByUri);
  const byId = Object.assign({}, state.byId);
  const pendingById = Object.assign({}, state.pendingById);
  const abandoningById = Object.assign({}, state.abandoningById);
  const myClaims = new Set(
    claims
      .map(claim => claim.claim_id)
      .filter(claimId => Object.keys(abandoningById).indexOf(claimId) === -1)
  );

  claims.forEach(claim => {
    byId[claim.claim_id] = claim;

    const pending = Object.values(pendingById).find(pendingClaim => {
      return (
        pendingClaim.name == claim.name &&
        pendingClaim.channel_name == claim.channel_name
      );
    });

    if (pending) {
      delete pendingById[pending.claim_id];
    }
  });

  // Remove old timed out pending publishes
  const old = Object.values(pendingById)
    .filter(pendingClaim => Date.now() - pendingClaim.time >= 20 * 60 * 1000)
    .forEach(pendingClaim => {
      delete pendingById[pendingClaim.claim_id];
    });

  return Object.assign({}, state, {
    isFetchingClaimListMine: false,
    myClaims: myClaims,
    byId,
    pendingById,
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

reducers[types.FETCH_CHANNEL_CLAIMS_STARTED] = function(state, action) {
  const { uri, page } = action.data;
  const fetchingChannelClaims = Object.assign({}, state.fetchingChannelClaims);

  fetchingChannelClaims[uri] = page;

  return Object.assign({}, state, {
    fetchingChannelClaims,
  });
};

reducers[types.FETCH_CHANNEL_CLAIMS_COMPLETED] = function(state, action) {
  const { uri, claims, page } = action.data;

  const claimsByChannel = Object.assign({}, state.claimsByChannel);
  const byChannel = Object.assign({}, claimsByChannel[uri]);
  const allClaimIds = new Set(byChannel["all"]);
  const currentPageClaimIds = [];
  const byId = Object.assign({}, state.byId);
  const fetchingChannelClaims = Object.assign({}, state.fetchingChannelClaims);

  if (claims !== undefined) {
    claims.forEach(claim => {
      allClaimIds.add(claim.claim_id);
      currentPageClaimIds.push(claim.claim_id);
      byId[claim.claim_id] = claim;
    });
  }

  byChannel["all"] = allClaimIds;
  byChannel[page] = currentPageClaimIds;
  claimsByChannel[uri] = byChannel;
  delete fetchingChannelClaims[uri];

  return Object.assign({}, state, {
    claimsByChannel,
    byId,
    fetchingChannelClaims,
  });
};

reducers[types.ABANDON_CLAIM_STARTED] = function(state, action) {
  const { claimId } = action.data;
  const abandoningById = Object.assign({}, state.abandoningById);

  abandoningById[claimId] = true;

  return Object.assign({}, state, {
    abandoningById,
  });
};

reducers[types.ABANDON_CLAIM_SUCCEEDED] = function(state, action) {
  const { claimId } = action.data;
  const myClaims = new Set(state.myClaims);
  const byId = Object.assign({}, state.byId);
  const claimsByUri = Object.assign({}, state.claimsByUri);
  const uris = [];

  Object.keys(claimsByUri).forEach(uri => {
    if (claimsByUri[uri] === claimId) {
      delete claimsByUri[uri];
    }
  });

  delete byId[claimId];
  myClaims.delete(claimId);

  return Object.assign({}, state, {
    myClaims,
    byId,
    claimsByUri,
  });
};

reducers[types.CREATE_CHANNEL_COMPLETED] = function(state, action) {
  const { channelClaim } = action.data;
  const byId = Object.assign({}, state.byId);
  const myChannelClaims = new Set(state.myChannelClaims);

  byId[channelClaim.claim_id] = channelClaim;
  myChannelClaims.add(channelClaim.claim_id);

  return Object.assign({}, state, {
    byId,
    myChannelClaims,
  });
};

reducers[types.SET_CLAIM_SUPPORT_CLAIM] = function(state, action) {
  const oldClaimSupport = state.claimSupport;
  const newClaimSupport = Object.assign({}, oldClaimSupport, {
    claim_id: action.data.claim_id,
    name: action.data.name,
  });

  return Object.assign({}, state, {
    claimSupport: newClaimSupport,
  });
};

reducers[types.SET_CLAIM_SUPPORT_AMOUNT] = function(state, action) {
  const oldClaimSupport = state.claimSupport;
  const newClaimSupport = Object.assign({}, oldClaimSupport, {
    amount: parseFloat(action.data.amount),
  });

  return Object.assign({}, state, {
    claimSupport: newClaimSupport,
  });
};

reducers[types.CLAIM_SUPPORT_STARTED] = function(state, action) {
  const newClaimSupport = Object.assign({}, state.claimSupport, {
    sending: true,
  });

  return Object.assign({}, state, {
    claimSupport: newClaimSupport,
  });
};

reducers[types.CLAIM_SUPPORT_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    draftTransaction: buildClaimSupport(),
  });
};

reducers[types.CLAIM_SUPPORT_FAILED] = function(state, action) {
  const newClaimSupport = Object.assign({}, state.claimSupport, {
    sending: false,
    error: action.data.error,
  });

  return Object.assign({}, state, {
    claimSupport: newClaimSupport,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
