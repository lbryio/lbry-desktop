import { createSelector } from 'reselect';

export const selectState = state => state.filtered || {};

export const selectFilteredOutpoints = createSelector(
  selectState,
  state => state.filteredOutpoints
);
