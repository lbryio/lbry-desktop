import * as types from 'constants/action_types'
import lbryuri from 'lbryuri'

const reducers = {}
const defaultState = {
}

reducers[types.FILE_LIST_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    isFileListPending: true,
  })
}

reducers[types.FILE_LIST_COMPLETED] = function(state, action) {
  const {
    fileInfos,
  } = action.data

  const newFileInfos = Object.assign({}, state.fileInfos)
  fileInfos.forEach((fileInfo) => {
    newFileInfos[fileInfo.outpoint] = fileInfo
  })

  return Object.assign({}, state, {
    isFileListPending: false,
    fileInfos: newFileInfos
  })
}

reducers[types.FETCH_FILE_INFO_STARTED] = function(state, action) {
  const {
    outpoint
  } = action.data
  const newFetching = Object.assign({}, state.fetching)

  newFetching[outpoint] = true

  return Object.assign({}, state, {
    fetching: newFetching,
  })
}

reducers[types.FETCH_FILE_INFO_COMPLETED] = function(state, action) {
  const {
    fileInfo,
    outpoint,
  } = action.data

  const newFileInfos = Object.assign({}, state.fileInfos)
  const newFetching = Object.assign({}, state.fetching)

  newFileInfos[outpoint] = fileInfo
  delete newFetching[outpoint]

  return Object.assign({}, state, {
    fileInfos: newFileInfos,
    fetching: newFetching,
  })
}

reducers[types.DOWNLOADING_STARTED] = function(state, action) {
  const {
    uri,
    outpoint,
    fileInfo,
  } = action.data
  const newFileInfos = Object.assign({}, state.fileInfos)
  const newDownloading = Object.assign({}, state.downloading)
  const newDownloadingByUri = Object.assign({}, newDownloading.byUri)
  const newLoading = Object.assign({}, state.loading)
  const newLoadingByUri = Object.assign({}, newLoading)

  newDownloadingByUri[uri] = true
  newDownloading.byUri = newDownloadingByUri
  newFileInfos[outpoint] = fileInfo
  delete newLoadingByUri[uri]
  newLoading.byUri = newLoadingByUri

  return Object.assign({}, state, {
    downloading: newDownloading,
    fileInfos: newFileInfos,
    loading: newLoading,
  })
}

reducers[types.DOWNLOADING_PROGRESSED] = function(state, action) {
  const {
    uri,
    outpoint,
    fileInfo,
  } = action.data
  const newFileInfos = Object.assign({}, state.fileInfos)
  const newDownloading = Object.assign({}, state.downloading)

  newFileInfos[outpoint] = fileInfo
  newDownloading[uri] = true

  return Object.assign({}, state, {
    fileInfos: newByUri,
    downloading: newDownloading
  })
}

reducers[types.DOWNLOADING_COMPLETED] = function(state, action) {
  const {
    uri,
    outpoint,
    fileInfo,
  } = action.data
  const newFileInfos = Object.assign({}, state.fileInfos)
  const newDownloading = Object.assign({}, state.downloading)
  const newDownloadingByUri = Object.assign({}, newDownloading.byUri)

  newFileInfos[outpoint] = fileInfo
  delete newDownloadingByUri[uri]
  newDownloading.byUri = newDownloadingByUri

  return Object.assign({}, state, {
    fileInfos: newFileInfos,
    downloading: newDownloading,
  })
}

reducers[types.DELETE_FILE_STARTED] = function(state, action) {
  const {
    outpoint
  } = action.data
  const newDeleting = Object.assign({}, state.deleting)
  const newByUri = Object.assign({}, newDeleting.byUri)

  newFileInfos[outpoint] = true
  newDeleting.byUri = newFileInfos

  return Object.assign({}, state, {
    deleting: newDeleting,
  })
}

reducers[types.DELETE_FILE_COMPLETED] = function(state, action) {
  const {
    uri,
  } = action.data
  const newDeleting = Object.assign({}, state.deleting)
  const newDeletingByUri = Object.assign({}, newDeleting.byUri)
  const newFileInfos = Object.assign({}, state.fileInfos)

  delete newDeletingByUri[uri]
  newDeleting.byUri = newDeletingByUri
  delete newFileInfos[outpoint]

  return Object.assign({}, state, {
    deleting: newDeleting,
    fileInfos: newFileInfos,
  })
}

reducers[types.LOADING_VIDEO_STARTED] = function(state, action) {
  const {
    uri,
  } = action.data
  const newLoading = Object.assign({}, state.loading)
  const newFileInfos = Object.assign({}, newLoading.byUri)

  newFileInfos[outpoint] = true
  newLoading.byUri = newFileInfos

  return Object.assign({}, state, {
    loading: newLoading,
  })
}

reducers[types.LOADING_VIDEO_FAILED] = function(state, action) {
  const {
    uri,
  } = action.data
  const newLoading = Object.assign({}, state.loading)
  const newFileInfos = Object.assign({}, newLoading.byUri)

  delete newFileInfos[outpoint]
  newLoading.byUri = newFileInfos

  return Object.assign({}, state, {
    loading: newLoading,
  })
}

reducers[types.FETCH_DOWNLOADED_CONTENT_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    fetchingDownloadedContent: true,
  })
}

reducers[types.FETCH_DOWNLOADED_CONTENT_COMPLETED] = function(state, action) {
  const newFileInfos = Object.assign({}, state.fileInfos)

  action.data.fileInfos.forEach(fileInfo => {
    newFileInfos[fileInfo.outpoint] = fileInfo
  })

  return Object.assign({}, state, {
    fileInfos: newFileInfos,
    fetchingDownloadedContent: false
  })
}

reducers[types.FETCH_PUBLISHED_CONTENT_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    fetchingPublishedContent: true,
  })
}

reducers[types.FETCH_PUBLISHED_CONTENT_COMPLETED] = function(state, action) {
  const {
    fileInfos
  } = action.data
  const newFileInfos = Object.assign({}, state.fileInfos)

  fileInfos.forEach(fileInfo => {
    newFileInfos[fileInfo.outpoint] = fileInfo
  })

  return Object.assign({}, state, {
    fileInfos: newFileInfos,
    fetchingPublishedContent: false
  })
}



export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
