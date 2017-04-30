import {
  createSelector,
} from 'reselect'
import {
  selectCurrentUri,
  selectCurrentPage,
} from 'selectors/app'

export const _selectState = state => state.fileInfo || {}

export const selectAllFileInfoByUri = createSelector(
  _selectState,
  (state) => state.byUri || {}
)

export const selectCurrentUriRawFileInfo = createSelector(
  selectCurrentUri,
  selectAllFileInfoByUri,
  (uri, byUri) => byUri[uri]
)

export const selectCurrentUriFileInfo = createSelector(
  selectCurrentUriRawFileInfo,
  (fileInfo) => fileInfo
)

export const selectFetchingFileInfo = createSelector(
  _selectState,
  (state) => state.fetching || {}
)

export const selectFetchingCurrentUriFileInfo = createSelector(
  selectCurrentUri,
  selectFetchingFileInfo,
  (uri, byUri) => !!byUri[uri]
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
  (uri, byUri) => !!byUri[uri]
)

export const selectCurrentUriIsDownloaded = createSelector(
  selectCurrentUriFileInfo,
  (fileInfo) => {
    if (!fileInfo) return false
    if (!fileInfo.completed) return false
    if (!fileInfo.written_bytes > 0) return false

    return true
  }
)

export const shouldFetchCurrentUriFileInfo = createSelector(
  selectCurrentPage,
  selectCurrentUri,
  selectFetchingCurrentUriFileInfo,
  selectCurrentUriFileInfo,
  (page, uri, fetching, fileInfo) => {
    if (page != 'show') return false
    if (fetching) return false
    if (fileInfo != undefined) return false

    return true
  }
)

const selectFileInfoForUri = (state, props) => {
  return selectAllFileInfoByUri(state)[props.uri]
}

export const makeSelectFileInfoForUri = () => {
  return createSelector(
    selectFileInfoForUri,
    (fileInfo) => fileInfo
  )
}

const selectDownloadingForUri = (state, props) => {
  const byUri = selectDownloadingByUri(state)
  return byUri[props.uri]
}

export const makeSelectDownloadingForUri = () => {
  return createSelector(
    selectDownloadingForUri,
    (downloadingForUri) => !!downloadingForUri
  )
}

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

// TODO make this smarter so it doesn't start playing and immediately freeze
// while downloading more.
export const selectCurrentUriFileReadyToPlay = createSelector(
  selectCurrentUriFileInfo,
  (fileInfo) => (fileInfo || {}).written_bytes > 0
)

const selectLoadingForUri = (state, props) => {
  const byUri = selectLoadingByUri(state)
  return byUri[props.uri]
}

export const makeSelectLoadingForUri = () => {
  return createSelector(
    selectLoadingForUri,
    (loading) => !!loading
  )
}

export const selectDownloadedFileInfo = createSelector(
  selectAllFileInfoByUri,
  (byUri) => {
    const fileInfoList = []
    Object.keys(byUri).forEach(key => {
      const fileInfo = byUri[key]

      if (fileInfo.completed || fileInfo.written_bytes) {
        fileInfoList.push(fileInfo)
      }
    })

    return fileInfoList
  }
)
