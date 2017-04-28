import * as types from 'constants/action_types'

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

  newDownloading[uri] = true
  newByUri[uri] = fileInfo

  return Object.assign({}, state, {
    downloading: newDownloading,
    byUri: newByUri,
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

  newByUri[uri] = fileInfo
  delete newDownloading[uri]

  return Object.assign({}, state, {
    byUri: newByUri,
    downloading: newDownloading
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
