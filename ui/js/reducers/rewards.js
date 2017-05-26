import * as types from 'constants/action_types'

const reducers = {}
const defaultState = {
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
