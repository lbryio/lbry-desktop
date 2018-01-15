import { createSelector } from 'reselect';
import { parseQueryParams, toQueryString } from 'util/query_params';
import { normalizeURI } from 'lbryURI';

export const selectState = state => state.navigation || {};

export const selectCurrentPath = createSelector(selectState, state => state.currentPath);

export const computePageFromPath = path => path.replace(/^\//, '').split('?')[0];

export const selectCurrentPage = createSelector(selectCurrentPath, path =>
  computePageFromPath(path)
);

export const selectCurrentParams = createSelector(selectCurrentPath, path => {
  if (path === undefined) return {};
  if (!path.match(/\?/)) return {};

  return parseQueryParams(path.split('?')[1]);
});

export const makeSelectCurrentParam = param =>
  createSelector(selectCurrentParams, params => (params ? params[param] : undefined));

export const selectHeaderLinks = createSelector(selectCurrentPage, page => {
  // This contains intentional fall throughs
  switch (page) {
    case 'wallet':
    case 'history':
    case 'send':
    case 'getcredits':
    case 'invite':
    case 'rewards':
    case 'backup':
      return {
        wallet: __('Overview'),
        getcredits: __('Get Credits'),
        send: __('Send / Receive'),
        rewards: __('Rewards'),
        invite: __('Invites'),
        history: __('History'),
      };
    case 'downloaded':
    case 'published':
      return {
        downloaded: __('Downloaded'),
        published: __('Published'),
      };
    case 'settings':
    case 'help':
      return {
        settings: __('Settings'),
        help: __('Help'),
      };
    case 'discover':
    case 'subscriptions':
      return {
        discover: __('Discover'),
        subscriptions: __('Subscriptions'),
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
      case 'show': {
        const parts = [normalizeURI(params.uri)];
        // If the params has any keys other than "uri"
        if (Object.keys(params).length > 1) {
          parts.push(toQueryString(Object.assign({}, params, { uri: null })));
        }
        return parts.join('?');
      }
      case 'discover':
        return __('Discover');
      case false:
      case null:
      case '':
        return '';
      default:
        return '';
    }
  }
);

export const selectPathAfterAuth = createSelector(selectState, state => state.pathAfterAuth);

export const selectIsBackDisabled = createSelector(selectState, state => state.index === 0);

export const selectIsForwardDisabled = createSelector(
  selectState,
  state => state.index === state.stack.length - 1
);

export const selectHistoryIndex = createSelector(selectState, state => state.index);

export const selectHistoryStack = createSelector(selectState, state => state.stack);

// returns current page attributes (scrollY, path)
export const selectActiveHistoryEntry = createSelector(
  selectState,
  state => state.stack[state.index]
);
