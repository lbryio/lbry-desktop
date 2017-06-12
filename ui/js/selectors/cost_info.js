import { createSelector } from "reselect";

export const _selectState = state => state.costInfo || {};

export const selectAllCostInfoByUri = createSelector(
  _selectState,
  state => state.byUri || {}
);

export const selectCostInfoForUri = (state, props) => {
  return selectAllCostInfoByUri(state)[props.uri];
};

export const makeSelectCostInfoForUri = () => {
  return createSelector(selectCostInfoForUri, costInfo => costInfo);
};

export const selectFetchingCostInfo = createSelector(
  _selectState,
  state => state.fetching || {}
);

const selectFetchingCostInfoForUri = (state, props) => {
  return selectFetchingCostInfo(state)[props.uri];
};

export const makeSelectFetchingCostInfoForUri = () => {
  return createSelector(selectFetchingCostInfoForUri, fetching => !!fetching);
};
