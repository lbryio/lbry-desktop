import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {};

reducers[ACTIONS.FETCH_COST_INFO_STARTED] = (state, action) => {
  const { uri } = action.data;
  const newFetching = Object.assign({}, state.fetching);
  newFetching[uri] = true;

  return Object.assign({}, state, {
    fetching: newFetching,
  });
};

reducers[ACTIONS.FETCH_COST_INFO_COMPLETED] = (state, action) => {
  const { uri, costInfo } = action.data;
  const newByUri = Object.assign({}, state.byUri);
  const newFetching = Object.assign({}, state.fetching);

  newByUri[uri] = costInfo;
  delete newFetching[uri];

  return Object.assign({}, state, {
    byUri: newByUri,
    fetching: newFetching,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
