import { createSelector } from 'reselect'
import {
  selectDaemonReady,
  selectCurrentPage,
  selectCurrentUri,
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

export const selectFetchingFileInfos = createSelector(
  _selectState,
  (state) => state.fetchingFileInfos || {}
)

export const selectFetchingDownloadedContent = createSelector(
  _selectState,
  (state) => !!state.fetchingDownloadedContent
)

export const selectDownloadedContent = createSelector(
  _selectState,
  (state) => state.downloadedContent || {}
)

export const selectDownloadedContentFileInfos = createSelector(
  selectDownloadedContent,
  (downloadedContent) => downloadedContent.fileInfos || []
)

export const shouldFetchDownloadedContent = createSelector(
  selectDaemonReady,
  selectCurrentPage,
  selectFetchingDownloadedContent,
  selectDownloadedContent,
  (daemonReady, page, fetching, content) => {
    if (!daemonReady) return false
    if (page != 'downloaded') return false
    if (fetching) return false
    if (Object.keys(content).length != 0) return false

    return true
  }
)

export const selectFetchingPublishedContent = createSelector(
  _selectState,
  (state) => !!state.fetchingPublishedContent
)

export const selectPublishedContent = createSelector(
  _selectState,
  (state) => state.publishedContent || {}
)

export const shouldFetchPublishedContent = createSelector(
  selectDaemonReady,
  selectCurrentPage,
  selectFetchingPublishedContent,
  selectPublishedContent,
  (daemonReady, page, fetching, content) => {
    if (!daemonReady) return false
    if (page != 'published') return false
    if (fetching) return false
    if (Object.keys(content).length != 0) return false

    return true
  }
)

export const selectResolvingUris = createSelector(
  _selectState,
  (state) => state.resolvingUris || []
)

const selectResolvingUri = (state, props) => {
  return selectResolvingUris(state).indexOf(props.uri) != -1
}

export const makeSelectResolvingUri = () => {
  return createSelector(
    selectResolvingUri,
    (resolving) => resolving
  )
}
