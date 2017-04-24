import * as types from 'constants/action_types'

const reducers = {}
const defaultState = {
}

reducers[types.FETCH_FEATURED_CONTENT_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    fetchingFeaturedContent: true
  })
}

reducers[types.FETCH_FEATURED_CONTENT_COMPLETED] = function(state, action) {
  const {
    uris
  } = action.data
  const newFeaturedContent = Object.assign({}, state.featuredContent, {
    byCategory: uris,
  })

  return Object.assign({}, state, {
    fetchingFeaturedContent: false,
    featuredContent: newFeaturedContent
  })
}

reducers[types.RESOLVE_URI_STARTED] = function(state, action) {
  const {
    uri
  } = action.data

  const oldResolving = state.resolvingUris || []
  const newResolving = Object.assign([], oldResolving)
  if (newResolving.indexOf(uri) == -1) newResolving.push(uri)

  return Object.assign({}, state, {
    resolvingUris: newResolving
  })
}

reducers[types.RESOLVE_URI_COMPLETED] = function(state, action) {
  const {
    uri,
    claim,
    certificate,
  } = action.data
  const resolvedUris = Object.assign({}, state.resolvedUris)
  const resolvingUris = state.resolvingUris
  const index = state.resolvingUris.indexOf(uri)
  const newResolvingUris = [
    ...resolvingUris.slice(0, index),
    ...resolvingUris.slice(index + 1)
  ]

  resolvedUris[uri] = {
    claim: claim,
    certificate: certificate,
  }


  const newState = Object.assign({}, state, {
    resolvedUris: resolvedUris,
    resolvingUris: newResolvingUris,
  })

  return Object.assign({}, state, newState)
}

reducers[types.FETCH_DOWNLOADED_CONTENT_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    fetchingDownloadedContent: true,
  })
}

reducers[types.FETCH_DOWNLOADED_CONTENT_COMPLETED] = function(state, action) {
  const {
    fileInfos
  } = action.data
  const newDownloadedContent = Object.assign({}, state.downloadedContent, {
    fileInfos
  })

  return Object.assign({}, state, {
    downloadedContent: newDownloadedContent,
    fetchingDownloadedContent: false,
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
  const newPublishedContent = Object.assign({}, state.publishedContent, {
    fileInfos
  })

  return Object.assign({}, state, {
    publishedContent: newPublishedContent,
    fetchingPublishedContent: false,
  })
}

reducers[types.FETCH_FILE_INFO_STARTED] = function(state, action) {
  const {
    uri,
    output,
  } = action.data
  const newFetchingFileInfos = Object.assign({}, state.fetchingFileInfos)

  newFetchingFileInfos[uri] = true

  return Object.assign({}, state, {
    fetchingFileInfos: newFetchingFileInfos,
  })
}

reducers[types.FETCH_FILE_INFO_COMPLETED] = function(state, action) {
  const {
    uri,
    fileInfo,
  } = action.data
  const newFetchingFileInfos = Object.assign({}, state.fetchingFileInfos)
  const fileInfos = Object.assign({}, state.fileInfos)
  const byUri = Object.assign({}, fileInfos.byUri)

  byUri[uri] = fileInfo
  delete newFetchingFileInfos[uri]

  const newFileInfos = Object.assign({}, fileInfos, {
    byUri: byUri,
  })

  return Object.assign({}, state, {
    fetchingFileInfos: newFetchingFileInfos,
    fileInfos: newFileInfos,
  })
}

reducers[types.FETCH_COST_INFO_STARTED] = function(state, action) {
  const {
    uri,
  } = action.data
  const fetchingCostInfos = Object.assign({}, state.fetchingCostInfos)

  fetchingCostInfos[uri] = true

  return Object.assign({}, state, {
    fetchingCostInfos,
  })
}

reducers[types.FETCH_COST_INFO_COMPLETED] = function(state, action) {
  const {
    uri,
    costInfo,
  } = action.data

  const newFetchingCostInfos = Object.assign({}, state.fetchingCostInfos)
  const costInfos = Object.assign({}, state.costInfos)
  const byUri = Object.assign({}, costInfos.byUri)

  byUri[uri] = costInfo
  delete newFetchingCostInfos[uri]

  const newCostInfos = Object.assign({}, costInfos, {
    byUri: byUri,
  })

  return Object.assign({}, state, {
    fetchingCostInfos: newFetchingCostInfos,
    costInfos: newCostInfos,
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
