import { createSelector } from "reselect";
import { parseQueryParams, toQueryString } from "util/query_params";
import * as settings from "constants/settings.js";
import lbryuri from "lbryuri";

export const _selectState = state => state.navigation || {};

export const selectCurrentPath = createSelector(
  _selectState,
  state => state.currentPath
);

export const selectCurrentPage = createSelector(selectCurrentPath, path => {
  return path.replace(/^\//, "").split("?")[0];
});

export const selectCurrentParams = createSelector(selectCurrentPath, path => {
  if (path === undefined) return {};
  if (!path.match(/\?/)) return {};

  return parseQueryParams(path.split("?")[1]);
});

export const selectHeaderLinks = createSelector(selectCurrentPage, page => {
  // This contains intentional fall throughs
  switch (page) {
    case "wallet":
    case "send":
    case "receive":
    case "rewards":
    case "backup":
      return {
        wallet: __("Overview"),
        send: __("Send"),
        receive: __("Receive"),
        rewards: __("Rewards"),
      };
    case "downloaded":
    case "published":
      return {
        downloaded: __("Downloaded"),
        published: __("Published"),
      };
    case "settings":
    case "help":
      return {
        settings: __("Settings"),
        help: __("Help"),
      };
    default:
      return null;
  }
});

export const selectPageTitle = createSelector(
  selectCurrentPage,
  selectCurrentParams,
  (page, params) => {
    switch (page) {
      case "settings":
        return __("Settings");
      case "report":
        return __("Report");
      case "wallet":
        return __("Wallet");
      case "send":
        return __("Send");
      case "receive":
        return __("Receive");
      case "backup":
        return __("Backup");
      case "rewards":
        return __("Rewards");
      case "publish":
        return __("Publish");
      case "help":
        return __("Help");
      case "developer":
        return __("Developer");
      case "search":
        return params.query
          ? __("Search results for %s", params.query)
          : __("Search");
      case "show": {
        const parts = [lbryuri.normalize(params.uri)];
        // If the params has any keys other than "uri"
        if (Object.keys(params).length > 1) {
          parts.push(toQueryString(Object.assign({}, params, { uri: null })));
        }
        return parts.join("?");
      }
      case "downloaded":
        return __("Downloads & Purchases");
      case "published":
        return __("Publishes");
      case "discover":
        return __("Home");
      default:
        return "";
    }
  }
);

export const selectPathAfterAuth = createSelector(
  _selectState,
  state => state.pathAfterAuth
);

export const selectIsBackDisabled = createSelector(
  _selectState,
  state => state.index === 0
);

export const selectIsForwardDisabled = createSelector(
  _selectState,
  state => state.index === state.stack.length - 1
);

export const selectHistoryIndex = createSelector(
  _selectState,
  state => state.index
);

export const selectHistoryStack = createSelector(
  _selectState,
  state => state.stack
);
