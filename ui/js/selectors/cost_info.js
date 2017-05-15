import { createSelector } from 'reselect'

export const _selectState = state => state.costInfo || {}

export const selectAllCostInfoByUri = createSelector(
  _selectState,
  (state) => state.byUri || {}
)

export const selectCostInfoForUri = (state, props) => {
  return selectAllCostInfoByUri(state)[props.uri]
}

export const makeSelectCostInfoForUri = () => {
  return createSelector(
    selectCostInfoForUri,
    (costInfo) => costInfo
  )
}
