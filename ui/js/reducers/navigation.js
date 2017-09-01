import * as types from "constants/action_types";
import { parseQueryParams } from "util/query_params";

const currentPath = () => {
  const hash = document.location.hash;
  if (hash !== "") return hash.replace(/^#/, "");
  else return "/discover";
};

const reducers = {};
const defaultState = {
  currentPath: currentPath(),
  pathAfterAuth: "/discover",
  index: 0,
  stack: [],
};

reducers[types.DAEMON_READY] = function(state, action) {
  const { currentPath } = state;
  const params = parseQueryParams(currentPath.split("?")[1] || "");

  return Object.assign({}, state, {
    stack: [{ path: currentPath, scrollY: 0 }],
  });
};

reducers[types.CHANGE_PATH] = function(state, action) {
  return Object.assign({}, state, {
    currentPath: action.data.path,
  });
};

reducers[types.CHANGE_AFTER_AUTH_PATH] = function(state, action) {
  return Object.assign({}, state, {
    pathAfterAuth: action.data.path,
  });
};

reducers[types.HISTORY_NAVIGATE] = (state, action) => {
  const { stack, index } = state;

  let newState = {};

  const path = action.data.url;

  // Check for duplicated
  if (action.data.index >= 0) {
    newState.index = action.data.index;
  } else if (!stack[index] || stack[index].path !== path) {
    newState.stack = [...stack.slice(0, index + 1), { path, scrollY: 0 }];
    newState.index = newState.stack.length - 1;
  }

  history.replaceState(null, null, "#" + path); //this allows currentPath() to retain the URL on reload

  return Object.assign({}, state, newState);
};

reducers[types.WINDOW_SCROLLED] = (state, action) => {
  const { stack, index } = state;
  const { scrollY } = action.data;

  return Object.assign({}, state, {
    stack: state.stack.map((stackItem, itemIndex) => {
      if (itemIndex !== index) {
        return stackItem;
      }
      return {
        ...stackItem,
        scrollY: scrollY,
      };
    }),
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
