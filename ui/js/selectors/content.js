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

export const selectResolvedUris = createSelector(
  _selectState,
  (state) => state.resolvedUris || {}
)

export const selectCurrentResolvedUri = createSelector(
  selectCurrentUri,
  selectResolvedUris,
  (uri, resolvedUris) => resolvedUris[uri] || {}
)

export const selectCurrentResolvedUriClaim = createSelector(
  selectCurrentResolvedUri,
  (uri) => uri.claim || {}
)

export const selectCurrentResolvedUriClaimOutpoint = createSelector(
  selectCurrentResolvedUriClaim,
  (claim) => `${claim.txid}:${claim.nout}`
)

export const selectFileInfos = createSelector(
  _selectState,
  (state) => state.fileInfos || {}
)

export const selectFileInfosByUri = createSelector(
  selectFileInfos,
  (fileInfos) => fileInfos.byUri || {}
)

export const selectCurrentUriFileInfo = createSelector(
  selectCurrentUri,
  selectFileInfosByUri,
  (uri, byUri) => byUri[uri]
)

export const selectCurrentUriIsDownloaded = createSelector(
  selectCurrentUriFileInfo,
  (fileInfo) => fileInfo && fileInfo.length > 0
)

export const selectFetchingFileInfos = createSelector(
  _selectState,
  (state) => state.fetchingFileInfos || {}
)

export const selectCurrentUriFileReadyToPlay = createSelector(
  selectCurrentUriFileInfo,
  (fileInfo) => (fileInfo || {}).written_bytes > 0
)

export const selectIsFetchingCurrentUriFileInfo = createSelector(
  selectFetchingFileInfos,
  selectCurrentUri,
  (fetching, uri) => !!fetching[uri]
)

export const selectCurrentUriIsPlaying = createSelector(
  _selectState,
  selectCurrentUri,
  (state, uri) => state.nowPlaying == uri
)

export const selectCostInfos = createSelector(
  _selectState,
  (state) => state.costInfos || {}
)

export const selectCostInfosByUri = createSelector(
  selectCostInfos,
  (costInfos) => costInfos.byUri || {}
)

export const selectFetchingCostInfos = createSelector(
  _selectState,
  (state) => state.fetchingCostInfos || {}
)

export const selectIsFetchingCurrentUriCostInfo = createSelector(
  selectFetchingCostInfos,
  selectCurrentUri,
  (fetching, uri) => !!fetching[uri]
)

export const selectCurrentUriCostInfo = createSelector(
  selectCurrentUri,
  selectCostInfosByUri,
  (uri, byUri) => byUri[uri] || {}
)

export const shouldFetchCurrentUriCostInfo = createSelector(
  selectCurrentPage,
  selectCurrentUri,
  selectIsFetchingCurrentUriCostInfo,
  selectCurrentUriCostInfo,
  (page, uri, fetching, costInfo) => {
    if (page != 'show') return false
    if (fetching) return false
    if (Object.keys(costInfo).length != 0) return false

    return true
  }
)

export const shouldFetchCurrentUriFileInfo = createSelector(
  selectCurrentPage,
  selectCurrentUri,
  selectIsFetchingCurrentUriFileInfo,
  selectCurrentUriFileInfo,
  (page, uri, fetching, fileInfo) => {
    if (page != 'show') return false
    if (fetching) return false
    if (fileInfo != undefined) return false

    return true
  }
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

export const selectLoading = createSelector(
  _selectState,
  (state) => state.loading || {}
)

export const selectLoadingByUri = createSelector(
  selectLoading,
  (loading) => loading.byUri || {}
)

export const selectLoadingCurrentUri = createSelector(
  selectLoadingByUri,
  selectCurrentUri,
  (byUri, uri) => !!byUri[uri]
)

export const selectDownloading = createSelector(
  _selectState,
  (state) => state.downloading || {}
)

export const selectDownloadingByUri = createSelector(
  selectDownloading,
  (downloading) => downloading.byUri || {}
)

export const selectDownloadingCurrentUri = createSelector(
  selectCurrentUri,
  selectDownloadingByUri,
  (uri, byUri) => byUri[uri]
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
