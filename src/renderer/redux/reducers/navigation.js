import * as ACTIONS from 'constants/action_types';

const getCurrentPath = () => {
  const { hash } = document.location;
  if (hash !== '') return hash.replace(/^#/, '');
  return '/publish';
};

const reducers = {};
const defaultState = {
  currentPath: getCurrentPath(),
  pathAfterAuth: '/discover',
  index: 0,
  stack: [],
};

reducers[ACTIONS.DAEMON_READY] = state => {
  const { currentPath } = state;

  return Object.assign({}, state, {
    stack: [{ path: currentPath, scrollY: 0 }],
  });
};

reducers[ACTIONS.CHANGE_AFTER_AUTH_PATH] = (state, action) =>
  Object.assign({}, state, {
    pathAfterAuth: action.data.path,
  });

reducers[ACTIONS.HISTORY_NAVIGATE] = (state, action) => {
  const { stack, index } = state;
  const { url: path, index: newIndex } = action.data;

  const newState = {
    currentPath: path,
  };

  if (newIndex >= 0) {
    newState.index = newIndex;
  } else if (!stack[index] || stack[index].path !== path) {
    // ^ Check for duplicated
    newState.stack = [...stack.slice(0, index + 1), { path, scrollY: 0 }];
    newState.index = newState.stack.length - 1;
  }

  return Object.assign({}, state, newState);
};

reducers[ACTIONS.WINDOW_SCROLLED] = (state, action) => {
  const { index } = state;
  const { scrollY } = action.data;

  return Object.assign({}, state, {
    stack: state.stack.map((stackItem, itemIndex) => {
      if (itemIndex !== index) {
        return stackItem;
      }
      return {
        ...stackItem,
        scrollY,
      };
    }),
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
}
