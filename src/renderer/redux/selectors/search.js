import {
  selectCurrentPage,
  selectCurrentParams,
  selectPageTitle,
} from 'redux/selectors/navigation';
import { createSelector } from 'reselect';

export const selectState = state => state.search || {};

export const selectSearchQuery = createSelector(
  selectCurrentPage,
  selectCurrentParams,
  (page, params) => (page === 'search' ? params && params.query : null)
);

export const selectIsSearching = createSelector(selectState, state => state.searching);

export const selectSearchUrisByQuery = createSelector(selectState, state => state.urisByQuery);

export const makeSelectSearchUris = query =>
  // replace statement below is kind of ugly, and repeated in doSearch action
  createSelector(
    selectSearchUrisByQuery,
    byQuery => byQuery[query ? query.replace(/^lbry:\/\//i, '') : query]
  );

export const selectWunderBarAddress = createSelector(
  selectCurrentPage,
  selectPageTitle,
  selectSearchQuery,
  (page, title, query) => {
    // only populate the wunderbar address if we are on the file/channel pages
    // or show the search query
    if (page === 'show') {
      return title;
    } else if (page === 'search') {
      return query;
    }

    return '';
  }
);
