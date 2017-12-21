import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {
  urisByQuery: {},
  searching: false,
};

reducers[ACTIONS.SEARCH_STARTED] = function(state) {
  return Object.assign({}, state, {
    searching: true,
  });
};

reducers[ACTIONS.SEARCH_COMPLETED] = function(state, action) {
  const { query, uris } = action.data;

  return Object.assign({}, state, {
    searching: false,
    urisByQuery: Object.assign({}, state.urisByQuery, { [query]: uris }),
  });
};

reducers[ACTIONS.SEARCH_CANCELLED] = function(state) {
  return Object.assign({}, state, {
    searching: false,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
