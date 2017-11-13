import { createSelector } from "reselect";
import { selectCurrentParams } from "selectors/navigation";

export const _selectState = state => state.costInfo || {};

export const selectAllCostInfoByUri = createSelector(
  _selectState,
  state => state.byUri || {}
);

export const makeSelectCostInfoForUri = uri => {
  return createSelector(
    selectAllCostInfoByUri,
    costInfos => costInfos && costInfos[uri]
  );
};

export const selectCostForCurrentPageUri = createSelector(
  selectAllCostInfoByUri,
  selectCurrentParams,
  (costInfo, params) =>
    params.uri && costInfo[params.uri] ? costInfo[params.uri].cost : undefined
);

export const selectFetchingCostInfo = createSelector(
  _selectState,
  state => state.fetching || {}
);

export const makeSelectFetchingCostInfoForUri = uri => {
  return createSelector(
    selectFetchingCostInfo,
    fetchingByUri => fetchingByUri && fetchingByUri[uri]
  );
};
