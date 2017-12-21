import * as ACTIONS from 'constants/action_types';
import { selectHistoryStack, selectHistoryIndex } from 'redux/selectors/navigation';
import { toQueryString } from 'util/query_params';
import amplitude from 'amplitude-js';

export function doNavigate(path, params = {}, options = {}) {
  return function(dispatch) {
    if (!path) {
      return;
    }

    let url = path;
    if (params && Object.values(params).length) {
      url += `?${toQueryString(params)}`;
    }

    const { scrollY } = options;

    amplitude.getInstance().logEvent('NAVIGATION', { destination: url });

    dispatch({
      type: ACTIONS.HISTORY_NAVIGATE,
      data: { url, index: options.index, scrollY },
    });
  };
}

export function doAuthNavigate(pathAfterAuth = null, params = {}) {
  return function(dispatch) {
    if (pathAfterAuth) {
      dispatch({
        type: ACTIONS.CHANGE_AFTER_AUTH_PATH,
        data: {
          path: `${pathAfterAuth}?${toQueryString(params)}`,
        },
      });
    }
    dispatch(doNavigate('/auth'));
  };
}

export function doHistoryTraverse(dispatch, state, modifier) {
  const stack = selectHistoryStack(state);
  const index = selectHistoryIndex(state) + modifier;

  if (index >= 0 && index < stack.length) {
    const historyItem = stack[index];
    dispatch(doNavigate(historyItem.path, {}, { scrollY: historyItem.scrollY, index }));
  }
}

export function doHistoryBack() {
  return function(dispatch, getState) {
    return doHistoryTraverse(dispatch, getState(), -1);
  };
}

export function doHistoryForward() {
  return function(dispatch, getState) {
    return doHistoryTraverse(dispatch, getState(), 1);
  };
}

export function doRecordScroll(scroll) {
  return function(dispatch) {
    dispatch({
      type: ACTIONS.WINDOW_SCROLLED,
      data: { scrollY: scroll },
    });
  };
}
