import { createSelector } from 'reselect';
import { makeSelectClaimForUri } from 'lbry-redux';

const selectState = state => state.stats || {};
export const selectViewCount = createSelector(selectState, state => state.viewCountById);
export const selectSubCount = createSelector(selectState, state => state.subCountById);

export const makeSelectViewCountForUri = uri =>
  createSelector(
    makeSelectClaimForUri(uri),
    selectViewCount,
    (claim, viewCountById) => (claim ? viewCountById[claim.claim_id] || 0 : 0)
  );

export const makeSelectSubCountForUri = uri =>
  createSelector(
    makeSelectClaimForUri(uri),
    selectSubCount,
    (claim, subCountById) => (claim ? subCountById[claim.claim_id] || 0 : 0)
  );
