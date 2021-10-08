import { createSelector } from 'reselect';

export const selectState = state => state.costInfo || {};

export const selectAllCostInfoByUri = createSelector(selectState, state => state.byUri || {});

export const makeSelectCostInfoForUri = uri =>
  createSelector(selectAllCostInfoByUri, costInfos => costInfos && costInfos[uri]);

export const selectFetchingCostInfo = createSelector(selectState, state => state.fetching || {});

export const makeSelectFetchingCostInfoForUri = uri =>
  createSelector(selectFetchingCostInfo, fetchingByUri => fetchingByUri && fetchingByUri[uri]);
