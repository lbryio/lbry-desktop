import { createSelector } from "reselect";
import { selectCurrentParams } from "selectors/navigation";
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

export const makeSelectClaimForUri = uri => {
  return createSelector(
    selectClaimsByUri,
    claims => claims && claims[lbryuri.normalize(uri)]
  );
};

export const makeSelectClaimIsMine = rawUri => {
  const uri = lbryuri.normalize(rawUri);
  return createSelector(
    selectClaimsByUri,
    selectMyClaimsRaw,
    (claims, myClaims) =>
      claims &&
      claims[uri] &&
      claims[uri].claim_id &&
      myClaims.has(claims[uri].claim_id)
  );
};

export const selectAllFetchingChannelClaims = createSelector(
  _selectState,
  state => state.fetchingChannelClaims || {}
);

export const makeSelectFetchingChannelClaims = uri => {
  createSelector(
    selectAllFetchingChannelClaims,
    fetching => fetching && fetching[uri]
  );
};

export const makeSelectClaimsInChannelForCurrentPage = (uri, page = 1) => {
  return createSelector(
    selectClaimsById,
    selectAllClaimsByChannel,
    (byId, allClaims) => {
      const byChannel = allClaims[uri] || {};
      const claimIds = byChannel[page];

      if (!claimIds) return claimIds;

      return claimIds.map(claimId => byId[claimId]);
    }
  );
};

export const makeSelectMetadataForUri = uri => {
  return createSelector(makeSelectClaimForUri(uri), claim => {
    const metadata =
      claim && claim.value && claim.value.stream && claim.value.stream.metadata;

    const value = metadata ? metadata : claim === undefined ? undefined : null;
    return value;
  });
};

export const makeSelectContentTypeForUri = uri => {
  return createSelector(makeSelectClaimForUri(uri), claim => {
    const source =
      claim && claim.value && claim.value.stream && claim.value.stream.source;
    return source ? source.contentType : undefined;
  });
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

export const selectShowTipBox = createSelector(
  _selectState,
  state => state.supportTransaction.tipBoxShown
);
