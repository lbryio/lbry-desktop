import { createSelector } from 'reselect'
import {
  selectCurrentUri,
  selectCurrentPage,
} from 'selectors/app'

export const _selectState = state => state.costInfo || {}

export const selectAllCostInfoByUri = createSelector(
  _selectState,
  (state) => state.byUri || {}
)

export const selectCurrentUriCostInfo = createSelector(
  selectCurrentUri,
  selectAllCostInfoByUri,
  (uri, byUri) => byUri[uri] || {}
)

export const selectFetchingCostInfo = createSelector(
  _selectState,
  (state) => state.fetching || {}
)

export const selectFetchingCurrentUriCostInfo = createSelector(
  selectCurrentUri,
  selectFetchingCostInfo,
  (uri, byUri) => !!byUri[uri]
)

export const shouldFetchCurrentUriCostInfo = createSelector(
  selectCurrentPage,
  selectCurrentUri,
  selectFetchingCurrentUriCostInfo,
  selectCurrentUriCostInfo,
  (page, uri, fetching, costInfo) => {
    if (page != 'show') return false
    if (fetching) return false
    if (Object.keys(costInfo).length != 0) return false

    return true
  }
)

const selectCostInfoForUri = (state, props) => {
  return selectAllCostInfoByUri(state)[props.uri]
}

export const makeSelectCostInfoForUri = () => {
  return createSelector(
    selectCostInfoForUri,
    (costInfo) => costInfo
  )
}
