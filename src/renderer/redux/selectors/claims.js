import { normalizeURI } from 'lbryURI';
import { makeSelectCurrentParam } from 'redux/selectors/navigation';
import { createSelector } from 'reselect';

const selectState = state => state.claims || {};

export const selectClaimsById = createSelector(selectState, state => state.byId || {});

export const selectClaimById = id =>
  createSelector(selectClaimsById, claims => {
    const claimById = claims[id];
    return claimById;
  });

export const selectClaimsByUri = createSelector(selectState, selectClaimsById, (state, byId) => {
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
      claims[uri] = byId[claimId];
    }
  });

  return claims;
});

export const selectAllClaimsByChannel = createSelector(
  selectState,
  state => state.claimsByChannel || {}
);

export const makeSelectClaimForUri = uri =>
  createSelector(selectClaimsByUri, claims => claims && claims[normalizeURI(uri)]);

export const selectMyClaimsRaw = createSelector(selectState, state => state.myClaims);

export const selectAbandoningIds = createSelector(selectState, state =>
  Object.keys(state.abandoningById || {})
);

export const selectMyActiveClaims = createSelector(
  selectMyClaimsRaw,
  selectAbandoningIds,
  (claims, abandoningIds) =>
    new Set(
      claims &&
        claims
          .map(claim => claim.claim_id)
          .filter(claimId => Object.keys(abandoningIds).indexOf(claimId) === -1)
    )
);

export const makeSelectClaimIsMine = rawUri => {
  const uri = normalizeURI(rawUri);
  return createSelector(
    selectClaimsByUri,
    selectMyActiveClaims,
    (claims, myClaims) =>
      claims && claims[uri] && claims[uri].claim_id && myClaims.has(claims[uri].claim_id)
  );
};

export const selectAllFetchingChannelClaims = createSelector(
  selectState,
  state => state.fetchingChannelClaims || {}
);

export const makeSelectFetchingChannelClaims = uri =>
  createSelector(selectAllFetchingChannelClaims, fetching => fetching && fetching[uri]);

export const makeSelectClaimsInChannelForCurrentPage = uri => {
  const pageSelector = makeSelectCurrentParam('page');

  return createSelector(
    selectClaimsById,
    selectAllClaimsByChannel,
    pageSelector,
    (byId, allClaims, page) => {
      const byChannel = allClaims[uri] || {};
      const claimIds = byChannel[page || 1];

      if (!claimIds) return claimIds;

      return claimIds.map(claimId => byId[claimId]);
    }
  );
};

export const makeSelectMetadataForUri = uri =>
  createSelector(makeSelectClaimForUri(uri), claim => {
    const metadata = claim && claim.value && claim.value.stream && claim.value.stream.metadata;

    return metadata || (claim === undefined ? undefined : null);
  });

export const makeSelectTitleForUri = uri =>
  createSelector(makeSelectMetadataForUri(uri), metadata => metadata && metadata.title);

export const makeSelectContentTypeForUri = uri =>
  createSelector(makeSelectClaimForUri(uri), claim => {
    const source = claim && claim.value && claim.value.stream && claim.value.stream.source;
    return source ? source.contentType : undefined;
  });

export const selectIsFetchingClaimListMine = createSelector(
  selectState,
  state => state.isFetchingClaimListMine
);

export const selectPendingClaims = createSelector(selectState, state =>
  Object.values(state.pendingById || {})
);

export const selectMyClaims = createSelector(
  selectMyActiveClaims,
  selectClaimsById,
  selectAbandoningIds,
  selectPendingClaims,
  (myClaimIds, byId, abandoningIds, pendingClaims) => {
    const claims = [];

    myClaimIds.forEach(id => {
      const claim = byId[id];

      if (claim && abandoningIds.indexOf(id) === -1) claims.push(claim);
    });

    return [...claims, ...pendingClaims];
  }
);

export const selectMyClaimsWithoutChannels = createSelector(selectMyClaims, myClaims =>
  myClaims.filter(claim => !claim.name.match(/^@/))
);

export const selectAllMyClaimsByOutpoint = createSelector(
  selectMyClaimsRaw,
  claims =>
    new Set(claims && claims.length ? claims.map(claim => `${claim.txid}:${claim.nout}`) : null)
);

export const selectMyClaimsOutpoints = createSelector(selectMyClaims, myClaims => {
  const outpoints = [];

  myClaims.forEach(claim => outpoints.push(`${claim.txid}:${claim.nout}`));

  return outpoints;
});

export const selectFetchingMyChannels = createSelector(
  selectState,
  state => state.fetchingMyChannels
);

export const selectMyChannelClaims = createSelector(
  selectState,
  selectClaimsById,
  (state, byId) => {
    const ids = state.myChannelClaims || [];
    const claims = [];

    ids.forEach(id => {
      if (byId[id]) {
        // I'm not sure why this check is necessary, but it ought to be a quick fix for https://github.com/lbryio/lbry-app/issues/544
        claims.push(byId[id]);
      }
    });

    return claims;
  }
);
