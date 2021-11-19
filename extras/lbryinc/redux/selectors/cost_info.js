// @flow
type State = { costInfo: any };

export const selectState = (state: State) => state.costInfo || {};
export const selectAllCostInfoByUri = (state: State) => selectState(state).byUri;
export const selectFetchingCostInfo = (state: State) => selectState(state).fetching;

export const selectCostInfoForUri = (state: State, uri: string) => {
  const costInfos = selectAllCostInfoByUri(state);
  return costInfos && costInfos[uri];
};

export const selectFetchingCostInfoForUri = (state: State, uri: string) => {
  const fetchingByUri = selectFetchingCostInfo(state);
  return fetchingByUri && fetchingByUri[uri];
};
