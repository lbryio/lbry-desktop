import {
  createSelector,
} from 'reselect'
import {
  selectMyClaimsOutpoints,
} from 'selectors/claims'

export const _selectState = state => state.fileInfo || {}

export const selectAllFileInfoByUri = createSelector(
  _selectState,
  (state) => state.byUri || {}
)

export const selectDownloading = createSelector(
  _selectState,
  (state) => state.downloading || {}
)

export const selectDownloadingByUri = createSelector(
  selectDownloading,
  (downloading) => downloading.byUri || {}
)

export const selectFileInfoForUri = (state, props) => {
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

export const selectPublishedFileInfo = createSelector(
  selectAllFileInfoByUri,
  selectMyClaimsOutpoints,
  (byUri, outpoints) => {
    const fileInfos = []
    outpoints.forEach(outpoint => {
      Object.keys(byUri).forEach(key => {
        const fileInfo = byUri[key]
        if (fileInfo.outpoint == outpoint) {
          fileInfos.push(fileInfo)
        }
      })
    })

    return fileInfos
  }
)
