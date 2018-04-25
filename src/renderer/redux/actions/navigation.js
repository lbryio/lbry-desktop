import { ACTIONS, selectHistoryIndex, selectHistoryStack } from 'lbry-redux';
import { toQueryString } from 'util/query_params';
import analytics from 'analytics';

export function doNavigate(path, params = {}, options = {}) {
  return dispatch => {
    if (!path) {
      return;
    }

    let url = path;
    if (params && Object.values(params).length) {
      url += `?${toQueryString(params)}`;
    }

    analytics.track('NAVIGATION', { destination: url });

    const { scrollY } = options;

    dispatch({
      type: ACTIONS.HISTORY_NAVIGATE,
      data: { url, index: options.index, scrollY },
    });
  };
}

export function doAuthNavigate(pathAfterAuth = null, params = {}) {
  return dispatch => {
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
  return (dispatch, getState) => doHistoryTraverse(dispatch, getState(), -1);
}

export function doHistoryForward() {
  return (dispatch, getState) => doHistoryTraverse(dispatch, getState(), 1);
}

export function doRecordScroll(scroll) {
  return dispatch => {
    dispatch({
      type: ACTIONS.WINDOW_SCROLLED,
      data: { scrollY: scroll },
    });
  };
}
