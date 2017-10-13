import { createSelector } from "reselect";
import {
  selectPageTitle,
  selectCurrentPage,
  selectCurrentParams,
} from "selectors/navigation";

export const _selectState = state => state.search || {};

export const selectSearchQuery = createSelector(
  selectCurrentPage,
  selectCurrentParams,
  (page, params) => (page === "search" ? params && params.query : null)
);

export const selectIsSearching = createSelector(
  _selectState,
  state => !!state.searching
);

export const selectSearchUrisByQuery = createSelector(
  _selectState,
  state => state.urisByQuery
);

export const makeSelectSearchUris = query => {
  //replace statement below is kind of ugly, and repeated in doSearch action
  return createSelector(
    selectSearchUrisByQuery,
    byQuery => byQuery[query ? query.replace(/^lbry:\/\//i, "") : query]
  );
};

export const selectWunderBarAddress = createSelector(
  selectCurrentPage,
  selectPageTitle,
  selectSearchQuery,
  (page, title, query) => (page != "search" ? title : query ? query : title)
);

export const selectWunderBarIcon = createSelector(
  selectCurrentPage,
  selectCurrentParams,
  (page, params) => {
    switch (page) {
      case "auth":
        return "icon-user";
      case "settings":
        return "icon-gear";
      case "help":
        return "icon-question";
      case "report":
        return "icon-file";
      case "downloaded":
        return "icon-folder";
      case "published":
        return "icon-folder";
      case "history":
        return "icon-history";
      case "send":
        return "icon-send";
      case "rewards":
        return "icon-rocket";
      case "invite":
        return "icon-envelope-open";
      case "address":
      case "receive":
        return "icon-address-book";
      case "wallet":
      case "backup":
        return "icon-bank";
      case "show":
        return "icon-file";
      case "publish":
        return params.id ? __("icon-pencil") : __("icon-upload");
      case "developer":
        return "icon-code";
      case "discover":
      case "search":
        return "icon-search";
      default:
        return "icon-file";
    }
  }
);
