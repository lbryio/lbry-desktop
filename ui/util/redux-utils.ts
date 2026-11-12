// util for creating reducers
// based off of redux-actions
// https://redux-actions.js.org/docs/api/handleAction.html#handleactions

export const handleActions =
  // Each handler gets the action shape of its own type, so the payload is `any` here.
  (
      actionMap: Record<string, (state: any, action: any) => unknown>,
      defaultState: unknown
    ): ((state: any, action: { type: string }) => any) =>
    (state: any = defaultState, action: { type: string }): any => {
      const handler = actionMap[action.type];

      if (handler) {
        const newState = handler(state, action);
        return Object.assign({}, state, newState);
      }

      // just return the original state if no handler
      // returning a copy here breaks redux-persist
      return state;
    };
