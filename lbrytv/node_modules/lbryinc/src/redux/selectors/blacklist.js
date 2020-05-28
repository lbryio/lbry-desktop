import { createSelector } from 'reselect';

export const selectState = state => state.blacklist || {};

export const selectBlackListedOutpoints = createSelector(
  selectState,
  state => state.blackListedOutpoints
);
