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
  (page, title, query) => (page !== 'search' ? title : query || title)
);

export const selectWunderBarIcon = createSelector(
  selectCurrentPage,
  selectCurrentParams,
  (page, params) => {
    switch (page) {
      case 'auth':
        return 'icon-user';
      case 'settings':
        return 'icon-gear';
      case 'help':
        return 'icon-question';
      case 'report':
        return 'icon-file';
      case 'downloaded':
        return 'icon-folder';
      case 'published':
        return 'icon-folder';
      case 'history':
        return 'icon-history';
      case 'send':
        return 'icon-send';
      case 'rewards':
        return 'icon-rocket';
      case 'invite':
        return 'icon-envelope-open';
      case 'getcredits':
        return 'icon-shopping-cart';
      case 'wallet':
      case 'backup':
        return 'icon-bank';
      case 'show':
        return 'icon-file';
      case 'publish':
        return params.id ? __('icon-pencil') : __('icon-upload');
      case 'developer':
        return 'icon-code';
      case 'discover':
      case 'search':
        return 'icon-search';
      case 'subscriptions':
        return 'icon-th-list';
      default:
        return 'icon-file';
    }
  }
);
