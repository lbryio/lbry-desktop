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
    return fileInfo && (fileInfo.written_bytes > 0 || fileInfo.completed)
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
