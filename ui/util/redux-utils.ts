// util for creating reducers
// based off of redux-actions
// https://redux-actions.js.org/docs/api/handleAction.html#handleactions

// Every action has a type; most also carry their payload in `data`.
type ReducerAction = { type: string; data?: any };

export const handleActions =
  // Each handler gets the action shape of its own type, so the payload is `any` here.
  (
      actionMap: Record<string, (state: any, action: any) => unknown>,
      defaultState: unknown
    ): ((state: any, action: ReducerAction) => any) =>
    (state: any = defaultState, action: ReducerAction): any => {
      const handler = actionMap[action.type];

      if (handler) {
        const newState = handler(state, action);
        // A handler that returns the state it was given changed nothing. Keep the same object so
        // connected components don't recompute for a no-op (#707).
        if (newState === state) return state;
        return Object.assign({}, state, newState);
      }

      // just return the original state if no handler
      // returning a copy here breaks redux-persist
      return state;
    };
