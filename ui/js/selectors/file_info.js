import {
  createSelector,
} from 'reselect'
import {
  selectClaimsByUri,
  selectMyClaimsOutpoints,
} from 'selectors/claims'

export const _selectState = state => state.fileInfo || {}

export const selectIsFileListPending = createSelector(
  _selectState,
  (state) => state.isFileListPending
)

export const selectAllFileInfos = createSelector(
  _selectState,
  (state) => state.fileInfos || {}
)

export const selectDownloading = createSelector(
  _selectState,
  (state) => state.downloading || {}
)

export const selectDownloadingByUri = createSelector(
  selectDownloading,
  (downloading) => downloading.byUri || {}
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

export const selectFetchingPublishedContent = createSelector(
  _selectState,
  (state) => !!state.fetchingPublishedContent
)

export const selectPublishedContent = createSelector(
  _selectState,
  (state) => state.publishedContent || {}
)

export const selectFileInfoForUri = (state, props) => {
  const claims = selectClaimsByUri(state),
        claim = claims[props.uri],
        outpoint = claim ? `${claim.txid}:${claim.nout}` : undefined

  console.log('select file info')
  console.log(claims)
  console.log(claim)
  console.log(outpoint)
  console.log(selectAllFileInfos(state))
  return outpoint ? selectAllFileInfos(state)[outpoint] : undefined
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
  selectAllFileInfos,
  (fileInfos) => {
    const fileInfoList = []
    Object.keys(fileInfos).forEach(outpoint => {
      const fileInfo = fileInfos[outpoint]
      if (fileInfo.completed || fileInfo.written_bytes) {
        fileInfoList.push(fileInfo)
      }
    })
    return fileInfoList
  }
)

export const selectPublishedFileInfo = createSelector(
  selectAllFileInfos,
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
