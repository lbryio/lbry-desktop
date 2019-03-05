import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {};

reducers[ACTIONS.FETCH_AVAILABILITY_STARTED] = (state, action) => {
  const { uri } = action.data;
  const newFetching = Object.assign({}, state.fetching);

  newFetching[uri] = true;

  return Object.assign({}, state, {
    fetching: newFetching,
  });
};

reducers[ACTIONS.FETCH_AVAILABILITY_COMPLETED] = (state, action) => {
  const { uri, availability } = action.data;

  const newFetching = Object.assign({}, state.fetching);
  const newAvailabilityByUri = Object.assign({}, state.byUri);

  delete newFetching[uri];
  newAvailabilityByUri[uri] = availability;

  return Object.assign({}, state, {
    fetching: newFetching,
    byUri: newAvailabilityByUri,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
