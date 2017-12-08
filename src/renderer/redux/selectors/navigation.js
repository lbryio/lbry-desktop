import { createSelector } from "reselect";
import { parseQueryParams, toQueryString } from "util/query_params";
import * as settings from "constants/settings.js";
import lbryuri from "lbryuri";

export const _selectState = state => state.navigation || {};

export const selectCurrentPath = createSelector(
  _selectState,
  state => state.currentPath
);

export const computePageFromPath = path =>
  path.replace(/^\//, "").split("?")[0];

export const selectCurrentPage = createSelector(selectCurrentPath, path => {
  return computePageFromPath(path);
});

export const selectCurrentParams = createSelector(selectCurrentPath, path => {
  if (path === undefined) return {};
  if (!path.match(/\?/)) return {};

  return parseQueryParams(path.split("?")[1]);
});

export const makeSelectCurrentParam = param => {
  return createSelector(
    selectCurrentParams,
    params => (params ? params[param] : undefined)
  );
};

export const selectHeaderLinks = createSelector(selectCurrentPage, page => {
  // This contains intentional fall throughs
  switch (page) {
    case "wallet":
    case "history":
    case "send":
    case "receive":
    case "invite":
    case "rewards":
    case "backup":
      return {
        wallet: __("Overview"),
        history: __("History"),
        send: __("Send Credits"),
        receive: __("Get Credits"),
        rewards: __("Rewards"),
        invite: __("Invites"),
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
        return __("Send LBRY Credits");
      case "receive":
        return __("Get LBRY Credits");
      case "backup":
        return __("Backup Your Wallet");
      case "rewards":
        return __("Rewards");
      case "invite":
        return __("Invites");
      case "start":
        return __("Start");
      case "publish":
        return params.id ? __("Edit") : __("Publish");
      case "help":
        return __("Help");
      case "developer":
        return __("Developer");
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
      case "search":
        return params.query
          ? __("Search results for %s", params.query)
          : __("Search");
      case "discover":
      case false:
      case null:
      case "":
        return "";
      default:
        return page[0].toUpperCase() + (page.length > 0 ? page.substr(1) : "");
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

// returns current page attributes (scrollY, path)
export const selectActiveHistoryEntry = createSelector(
  _selectState,
  state => state.stack[state.index]
);
