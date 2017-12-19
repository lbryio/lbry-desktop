import * as types from "constants/action_types";
import {
  computePageFromPath,
  selectPageTitle,
  selectCurrentPage,
  selectCurrentParams,
  selectHistoryStack,
  selectHistoryIndex,
} from "redux/selectors/navigation";
import { doSearch } from "redux/actions/search";
import { toQueryString } from "util/query_params";

export function doNavigate(path, params = {}, options = {}) {
  return function(dispatch, getState) {
    if (!path) {
      return;
    }

    let url = path;
    if (params && Object.values(params).length) {
      url += "?" + toQueryString(params);
    }

    const scrollY = options.scrollY;

    dispatch({
      type: types.HISTORY_NAVIGATE,
      data: { url, index: options.index, scrollY },
    });
  };
}

export function doAuthNavigate(pathAfterAuth = null, params = {}) {
  return function(dispatch, getState) {
    if (pathAfterAuth) {
      dispatch({
        type: types.CHANGE_AFTER_AUTH_PATH,
        data: {
          path: `${pathAfterAuth}?${toQueryString(params)}`,
        },
      });
    }
    dispatch(doNavigate("/auth"));
  };
}

export function doHistoryTraverse(dispatch, state, modifier) {
  const stack = selectHistoryStack(state),
    index = selectHistoryIndex(state) + modifier;

  if (index >= 0 && index < stack.length) {
    const historyItem = stack[index];
    return dispatch(
      doNavigate(historyItem.path, {}, { scrollY: historyItem.scrollY, index })
    );
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
  return function(dispatch, getState) {
    dispatch({
      type: types.WINDOW_SCROLLED,
      data: { scrollY: scroll },
    });
  };
}
