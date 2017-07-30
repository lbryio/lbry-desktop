import { createSelector } from "reselect";
import { selectCurrentParams } from "selectors/app";
import lbryuri from "lbryuri";

const _selectState = state => state.claims || {};

export const selectClaimsById = createSelector(
  _selectState,
  state => state.byId || {}
);

export const selectClaimsByUri = createSelector(
  _selectState,
  selectClaimsById,
  (state, byId) => {
    const byUri = state.claimsByUri || {};
    const claims = {};

    Object.keys(byUri).forEach(uri => {
      const claimId = byUri[uri];

      // NOTE returning a null claim allows us to differentiate between an
      // undefined (never fetched claim) and one which just doesn't exist. Not
      // the cleanest solution but couldn't think of anything better right now
      if (claimId === null) {
        claims[uri] = null;
      } else {
        const claim = byId[claimId];

        claims[uri] = claim;
      }
    });

    return claims;
  }
);

export const selectAllClaimsByChannel = createSelector(
  _selectState,
  state => state.claimsByChannel || {}
);

const selectClaimForUri = (state, props) => {
  const uri = lbryuri.normalize(props.uri);
  return selectClaimsByUri(state)[uri];
};

export const makeSelectClaimForUri = () => {
  return createSelector(selectClaimForUri, claim => claim);
};

const selectClaimForUriIsMine = (state, props) => {
  const uri = lbryuri.normalize(props.uri);
  const claim = selectClaimsByUri(state)[uri];
  const myClaims = selectMyClaimsRaw(state);

  return myClaims.has(claim.claim_id);
};

export const makeSelectClaimForUriIsMine = () => {
  return createSelector(selectClaimForUriIsMine, isMine => isMine);
};

export const selectAllFetchingChannelClaims = createSelector(
  _selectState,
  state => state.fetchingChannelClaims || {}
);

const selectFetchingChannelClaims = (state, props) => {
  const allFetchingChannelClaims = selectAllFetchingChannelClaims(state);

  return allFetchingChannelClaims[props.uri];
};

export const makeSelectFetchingChannelClaims = (state, props) => {
  return createSelector(selectFetchingChannelClaims, fetching => fetching);
};

export const selectClaimsInChannelForUri = (state, props) => {
  const byId = selectClaimsById(state);
  const byChannel = selectAllClaimsByChannel(state)[props.uri] || {};
  const claimIds = byChannel["all"];

  if (!claimIds) return claimIds;

  const claims = [];

  claimIds.forEach(claimId => claims.push(byId[claimId]));

  return claims;
};

export const makeSelectClaimsInChannelForUri = () => {
  return createSelector(selectClaimsInChannelForUri, claims => claims);
};

export const selectClaimsInChannelForCurrentPage = (state, props) => {
  const byId = selectClaimsById(state);
  const byChannel = selectAllClaimsByChannel(state)[props.uri] || {};
  const params = selectCurrentParams(state);
  const page = params && params.page ? params.page : 1;
  const claimIds = byChannel[page];

  if (!claimIds) return claimIds;

  const claims = [];

  claimIds.forEach(claimId => claims.push(byId[claimId]));

  return claims;
};

export const makeSelectClaimsInChannelForCurrentPage = () => {
  return createSelector(selectClaimsInChannelForCurrentPage, claims => claims);
};

const selectMetadataForUri = (state, props) => {
  const claim = selectClaimForUri(state, props);
  const metadata =
    claim && claim.value && claim.value.stream && claim.value.stream.metadata;

  const value = metadata ? metadata : claim === undefined ? undefined : null;
  return value;
};

export const makeSelectMetadataForUri = () => {
  return createSelector(selectMetadataForUri, metadata => metadata);
};

const selectSourceForUri = (state, props) => {
  const claim = selectClaimForUri(state, props);
  const source =
    claim && claim.value && claim.value.stream && claim.value.stream.source;

  return source ? source : claim === undefined ? undefined : null;
};

export const makeSelectSourceForUri = () => {
  return createSelector(selectSourceForUri, source => source);
};

export const makeSelectContentTypeForUri = () => {
  return createSelector(
    selectSourceForUri,
    source => (source ? source.contentType : source)
  );
};

export const selectIsFetchingClaimListMine = createSelector(
  _selectState,
  state => !!state.isFetchingClaimListMine
);

export const selectMyClaimsRaw = createSelector(
  _selectState,
  state => new Set(state.myClaims)
);

export const selectAbandoningIds = createSelector(_selectState, state =>
  Object.keys(state.abandoningById || {})
);

export const selectPendingClaims = createSelector(_selectState, state =>
  Object.values(state.pendingById || {})
);

export const selectMyClaims = createSelector(
  selectMyClaimsRaw,
  selectClaimsById,
  selectAbandoningIds,
  selectPendingClaims,
  (myClaimIds, byId, abandoningIds, pendingClaims) => {
    const claims = [];

    myClaimIds.forEach(id => {
      const claim = byId[id];

      if (claim && abandoningIds.indexOf(id) == -1) claims.push(claim);
    });

    return [...claims, ...pendingClaims];
  }
);

export const selectMyClaimsWithoutChannels = createSelector(
  selectMyClaims,
  myClaims => myClaims.filter(claim => !claim.name.match(/^@/))
);

export const selectMyClaimsOutpoints = createSelector(
  selectMyClaims,
  myClaims => {
    const outpoints = [];

    myClaims.forEach(claim => outpoints.push(`${claim.txid}:${claim.nout}`));

    return outpoints;
  }
);

export const selectFetchingMyChannels = createSelector(
  _selectState,
  state => !!state.fetchingMyChannels
);

export const selectMyChannelClaims = createSelector(
  _selectState,
  selectClaimsById,
  (state, byId) => {
    const ids = state.myChannelClaims || [];
    const claims = [];

    ids.forEach(id => claims.push(byId[id]));

    return claims;
  }
);

export const selectClaimSupport = createSelector(
  _selectState,
  state => state.claimSupport || {}
);

export const selectClaimSupportAmount = createSelector(
  selectClaimSupport,
  claimSupport => claimSupport.amount
);
