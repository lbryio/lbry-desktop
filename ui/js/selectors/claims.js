import { createSelector } from "reselect";
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

export const selectClaimsInChannelForUri = (state, props) => {
  return selectAllClaimsByChannel(state)[props.uri];
};

export const makeSelectClaimsInChannelForUri = () => {
  return createSelector(selectClaimsInChannelForUri, claims => claims);
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

export const selectClaimListMineIsPending = createSelector(
  _selectState,
  state => state.isClaimListMinePending
);

export const selectMyClaims = createSelector(
  _selectState,
  state => state.myClaims || new Set()
);

export const selectMyClaimsOutpoints = createSelector(
  selectMyClaims,
  selectClaimsById,
  (claimIds, byId) => {
    const outpoints = [];

    claimIds.forEach(claimId => {
      const claim = byId[claimId];
      if (claim) outpoints.push(`${claim.txid}:${claim.nout}`);
    });

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
