import { createSelector } from 'reselect'
import {
  selectCurrentParams,
  selectDaemonReady,
  selectSearchQuery,
} from 'selectors/app'

export const _selectState = state => state.search || {}

export const selectIsSearching = createSelector(
  _selectState,
  (state) => !!state.searching
)

export const selectSearchResults = createSelector(
  _selectState,
  (state) => state.results || {}
)

export const selectSearchResultsByQuery = createSelector(
  selectSearchResults,
  (results) => results.byQuery || {}
)

export const selectCurrentSearchResults = createSelector(
  selectSearchQuery,
  selectSearchResultsByQuery,
  (query, byQuery) => byQuery[query] || []
)

export const selectSearchActivated = createSelector(
  _selectState,
  (state) => !!state.activated
)

export const shouldSearch = createSelector(
  selectDaemonReady,
  selectSearchQuery,
  selectIsSearching,
  selectSearchResultsByQuery,
  (daemonReady, query, isSearching, resultsByQuery) => {
    if (!daemonReady) return false
    if (!query) return false
    if (isSearching) return false
    if (Object.keys(resultsByQuery).indexOf(query) != -1) return false

    return true
  }
)
