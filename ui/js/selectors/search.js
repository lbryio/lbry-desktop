import { createSelector } from 'reselect'

export const _selectState = state => state.search || {}

export const selectSearchQuery = createSelector(
  _selectState,
  (state) => state.query
)

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
