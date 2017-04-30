import * as types from 'constants/action_types'
import lbryuri from 'lbryuri'

const reducers = {}
const defaultState = {
}

reducers[types.FETCH_FILE_INFO_STARTED] = function(state, action) {
  const {
    uri,
  } = action.data
  const newFetching = Object.assign({}, state.fetching)

  newFetching[uri] = true

  return Object.assign({}, state, {
    fetching: newFetching,
  })
}

reducers[types.FETCH_FILE_INFO_COMPLETED] = function(state, action) {
  const {
    uri,
    fileInfo,
  } = action.data
  const newByUri = Object.assign({}, state.byUri)
  const newFetching = Object.assign({}, state.fetching)

  newByUri[uri] = fileInfo || {}
  delete newFetching[uri]

  return Object.assign({}, state, {
    byUri: newByUri,
    fetching: newFetching,
  })
}

reducers[types.DOWNLOADING_STARTED] = function(state, action) {
  const {
    uri,
    fileInfo,
  } = action.data
  const newByUri = Object.assign({}, state.byUri)
  const newDownloading = Object.assign({}, state.downloading)
  const newDownloadingByUri = Object.assign({}, newDownloading.byUri)
  const newLoading = Object.assign({}, state.loading)
  const newLoadingByUri = Object.assign({}, newLoading)

  newDownloadingByUri[uri] = true
  newDownloading.byUri = newDownloadingByUri
  newByUri[uri] = fileInfo
  delete newLoadingByUri[uri]
  newLoading.byUri = newLoadingByUri

  return Object.assign({}, state, {
    downloading: newDownloading,
    byUri: newByUri,
    loading: newLoading,
  })
}

reducers[types.DOWNLOADING_PROGRESSED] = function(state, action) {
  const {
    uri,
    fileInfo,
  } = action.data
  const newByUri = Object.assign({}, state.byUri)
  const newDownloading = Object.assign({}, state.downloading)

  newByUri[uri] = fileInfo
  newDownloading[uri] = true

  return Object.assign({}, state, {
    byUri: newByUri,
    downloading: newDownloading
  })
}

reducers[types.DOWNLOADING_COMPLETED] = function(state, action) {
  const {
    uri,
    fileInfo,
  } = action.data
  const newByUri = Object.assign({}, state.byUri)
  const newDownloading = Object.assign({}, state.downloading)
  const newDownloadingByUri = Object.assign({}, newDownloading.byUri)

  newByUri[uri] = fileInfo
  delete newDownloadingByUri[uri]
  newDownloading.byUri = newDownloadingByUri

  return Object.assign({}, state, {
    byUri: newByUri,
    downloading: newDownloading,
  })
}

reducers[types.DELETE_FILE_STARTED] = function(state, action) {
  const {
    uri,
  } = action.data
  const newDeleting = Object.assign({}, state.deleting)
  const newByUri = Object.assign({}, newDeleting.byUri)

  newByUri[uri] = true
  newDeleting.byUri = newByUri

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
  const newByUri = Object.assign({}, state.byUri)

  delete newDeletingByUri[uri]
  newDeleting.byUri = newDeletingByUri
  delete newByUri[uri]

  return Object.assign({}, state, {
    deleting: newDeleting,
    byUri: newByUri,
  })
}

reducers[types.LOADING_VIDEO_STARTED] = function(state, action) {
  const {
    uri,
  } = action.data
  const newLoading = Object.assign({}, state.loading)
  const newByUri = Object.assign({}, newLoading.byUri)

  newByUri[uri] = true
  newLoading.byUri = newByUri

  return Object.assign({}, state, {
    loading: newLoading,
  })
}

reducers[types.LOADING_VIDEO_FAILED] = function(state, action) {
  const {
    uri,
  } = action.data
  const newLoading = Object.assign({}, state.loading)
  const newByUri = Object.assign({}, newLoading.byUri)

  delete newByUri[uri]
  newLoading.byUri = newByUri

  return Object.assign({}, state, {
    loading: newLoading,
  })
}

reducers[types.FETCH_DOWNLOADED_CONTENT_COMPLETED] = function(state, action) {
  const {
    fileInfos,
  } = action.data
  const newByUri = Object.assign({}, state.byUri)

  fileInfos.forEach(fileInfo => {
    const uri = lbryuri.build({
      channelName: fileInfo.channel_name,
      contentName: fileInfo.name,
    })

    newByUri[uri] = fileInfo
  })

  return Object.assign({}, state, {
    byUri: newByUri
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
