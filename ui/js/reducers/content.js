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

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
