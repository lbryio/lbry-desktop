import { createSelector } from "reselect";

export const _selectState = state => state.fileActions || {};

export const selectClaimSupport = createSelector(
  _selectState,
  state => state.claimSupport || {}
);

export const selectClaimSupportAmount = createSelector(
  selectClaimSupport,
  claimSupport => claimSupport.amount
);
