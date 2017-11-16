import * as types from "constants/action_types";

const reducers = {};
const defaultState = {
  urisByQuery: {},
  searching: false,
};

reducers[types.SEARCH_STARTED] = function(state, action) {
  const { query } = action.data;

  return Object.assign({}, state, {
    searching: true,
  });
};

reducers[types.SEARCH_COMPLETED] = function(state, action) {
  const { query, uris } = action.data;

  return Object.assign({}, state, {
    searching: false,
    urisByQuery: Object.assign({}, state.urisByQuery, { [query]: uris }),
  });
};

reducers[types.SEARCH_CANCELLED] = function(state, action) {
  return Object.assign({}, state, {
    searching: false,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
