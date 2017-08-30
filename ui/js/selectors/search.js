import { createSelector } from "reselect";
import { selectPageTitle, selectCurrentPage } from "selectors/app";

export const _selectState = state => state.search || {};

export const selectSearchQuery = createSelector(
  _selectState,
  state => state.query
);

export const selectIsSearching = createSelector(
  _selectState,
  state => !!state.searching
);

export const selectSearchResults = createSelector(
  _selectState,
  state => state.results || {}
);

export const selectSearchResultsByQuery = createSelector(
  selectSearchResults,
  results => results.byQuery || {}
);

export const selectCurrentSearchResults = createSelector(
  selectSearchQuery,
  selectSearchResultsByQuery,
  (query, byQuery) => byQuery[query]
);

export const selectWunderBarAddress = createSelector(
  selectCurrentPage,
  selectPageTitle,
  selectSearchQuery,
  (page, title, query) => (page != "search" ? title : query ? query : title)
);

export const selectWunderBarIcon = createSelector(selectCurrentPage, page => {
  switch (page) {
    case "auth":
      return "icon-user";
    case "search":
      return "icon-search";
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
    case "start":
      return "icon-file";
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
      return "icon-upload";
    case "developer":
      return "icon-code";
    case "discover":
      return "icon-home";
    default:
      return "icon-file";
  }
});
