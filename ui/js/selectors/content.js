import { createSelector } from 'reselect'
import {
  selectDaemonReady,
  selectCurrentPage,
} from 'selectors/app'

export const _selectState = state => state.content || {}

export const selectFeaturedContent = createSelector(
  _selectState,
  (state) => state.featuredContent || {}
)

export const selectFeaturedContentByCategory = createSelector(
  selectFeaturedContent,
  (featuredContent) => featuredContent.byCategory || {}
)

export const selectFetchingFeaturedContent = createSelector(
  _selectState,
  (state) => !!state.fetchingFeaturedContent
)

export const shouldFetchFeaturedContent = createSelector(
  selectDaemonReady,
  selectCurrentPage,
  selectFetchingFeaturedContent,
  selectFeaturedContentByCategory,
  (daemonReady, page, fetching, byCategory) => {
    if (!daemonReady) return false
    if (page != 'discover') return false
    if (fetching) return false
    if (Object.keys(byCategory).length != 0) return false

    return true
  }
)
