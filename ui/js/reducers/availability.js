import * as types from 'constants/action_types'

const reducers = {}
const defaultState = {
}

reducers[types.FETCH_AVAILABILITY_STARTED] = function(state, action) {
  const {
    uri,
  } = action.data
  const newFetching = Object.assign({}, state.fetching)
  const newByUri = Object.assign({}, newFetching.byUri)

  newByUri[uri] = true
  newFetching.byUri = newByUri

  return Object.assign({}, state, {
    fetching: newFetching,
  })
}

reducers[types.FETCH_AVAILABILITY_COMPLETED] = function(state, action) {
  const {
    uri,
    availability,
  } = action.data
  const newFetching = Object.assign({}, state.fetching)
  const newFetchingByUri = Object.assign({}, newFetching.byUri)
  const newAvailabilityByUri = Object.assign({}, state.byUri)

  delete newFetchingByUri[uri]
  newFetching.byUri = newFetchingByUri
  newAvailabilityByUri[uri] = availability

  return Object.assign({}, state, {
    fetching: newFetching,
    byUri: newAvailabilityByUri
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
