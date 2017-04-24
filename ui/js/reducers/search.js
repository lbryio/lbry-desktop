import * as types from 'constants/action_types'

const reducers = {}
const defaultState = {
}

reducers[types.SEARCH_STARTED] = function(state, action) {
  const {
    query,
  } = action.data

  return Object.assign({}, state, {
    searching: true,
    query: query,
  })
}

reducers[types.SEARCH_COMPLETED] = function(state, action) {
  const {
    query,
  } = action.data
  const newResults = Object.assign({}, state.results)
  const newByQuery = Object.assign({}, newResults.byQuery)
  newByQuery[query] = action.data.results

  return Object.assign({}, state, {
    searching: false,
    results: newResults,
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
