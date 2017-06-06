import * as types from "constants/action_types";
import lbryuri from "lbryuri";

const reducers = {};
const defaultState = {};

reducers[types.SEARCH_STARTED] = function(state, action) {
  const { query } = action.data;

  return Object.assign({}, state, {
    searching: true,
    query: query,
  });
};

reducers[types.SEARCH_COMPLETED] = function(state, action) {
  const { query, results } = action.data;
  const oldResults = Object.assign({}, state.results);
  const newByQuery = Object.assign({}, oldResults.byQuery);
  newByQuery[query] = results;
  const newResults = Object.assign({}, oldResults, {
    byQuery: newByQuery,
  });

  return Object.assign({}, state, {
    searching: false,
    results: newResults,
  });
};

reducers[types.SEARCH_CANCELLED] = function(state, action) {
  return Object.assign({}, state, {
    searching: false,
    query: undefined,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
