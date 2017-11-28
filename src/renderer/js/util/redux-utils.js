// util for creating reducers
// based off of redux-actions
// https://redux-actions.js.org/docs/api/handleAction.html#handleactions
export const handleActions = (actionMap, defaultState) => {
  return (state = defaultState, action) => {
    const handler = actionMap[action.type];
    const newState = handler ? handler(state, action) : {};
    return Object.assign({}, state, newState);
  };
};
