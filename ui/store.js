import * as ACTIONS from 'constants/action_types';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createCompressor from 'redux-persist-transform-compress';
import { createFilter, createBlacklistFilter } from 'redux-persist-transform-filter';
import localForage from 'localforage';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createMemoryHistory, createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import Lbry from 'lbry';
import { createAnalyticsMiddleware } from 'redux/middleware/analytics';
import { buildSharedStateMiddleware } from 'redux/middleware/shared-state';
import { doSyncLoop } from 'redux/actions/sync';
import { getAuthToken } from 'util/saved-passwords';
import { generateInitialUrl } from 'util/url';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';

function isFunction(object) {
  return typeof object === 'function';
}

function isNotFunction(object) {
  return !isFunction(object);
}

function createBulkThunkMiddleware() {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (action.type === 'BATCH_ACTIONS') {
      action.actions.filter(isFunction).map((actionFn) => actionFn(dispatch, getState));
    }
    return next(action);
  };
}

function enableBatching(reducer) {
  return function batchingReducer(state, action) {
    switch (action.type) {
      case 'BATCH_ACTIONS':
        return action.actions.filter(isNotFunction).reduce(batchingReducer, state);
      default:
        return reducer(state, action);
    }
  };
}

const contentFilter = createFilter('content', ['positions', 'history', 'lastViewedAnnouncement', 'recsysEntries']);
const fileInfoFilter = createFilter('fileInfo', [
  'fileListPublishedSort',
  'fileListDownloadedSort',
  'fileListSubscriptionSort',
]);
const appFilter = createFilter('app', [
  'hasClickedComment',
  'searchOptionsExpanded',
  'volume',
  'muted',
  'allowAnalytics',
  'welcomeVersion',
  'interestedInYoutubeSync',
  'splashAnimationEnabled',
  'activeChannel',
]);
const claimsFilter = createFilter('claims', ['pendingById']);
// We only need to persist the receiveAddress for the wallet
const walletFilter = createFilter('wallet', ['receiveAddress']);
const searchFilter = createFilter('search', ['options']);
const tagsFilter = createFilter('tags', ['followedTags']);
const subscriptionsFilter = createFilter('subscriptions', ['subscriptions']);
const blockedFilter = createFilter('blocked', ['blockedChannels']);
const coinSwapsFilter = createFilter('coinSwap', ['coinSwaps']);
const settingsFilter = createBlacklistFilter('settings', ['loadedLanguages', 'language']);
const collectionsFilter = createFilter('collections', ['builtin', 'saved', 'unpublished', 'edited', 'pending']);
const whiteListedReducers = [
  'claims',
  'fileInfo',
  'publish',
  'wallet',
  'tags',
  'content',
  'app',
  'search',
  'blocked',
  'coinSwap',
  'settings',
  'subscriptions',
  'collections',
];

const transforms = [
  claimsFilter,
  fileInfoFilter,
  walletFilter,
  blockedFilter,
  coinSwapsFilter,
  tagsFilter,
  appFilter,
  searchFilter,
  tagsFilter,
  contentFilter,
  subscriptionsFilter,
  settingsFilter,
  collectionsFilter,
  createCompressor(),
];

const persistOptions = {
  key: 'v0',
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  whitelist: whiteListedReducers,
  // Order is important. Needs to be compressed last or other transforms can't
  // read the data
  transforms,
};

let history;
// @if TARGET='app'
history = createMemoryHistory({
  initialEntries: [generateInitialUrl(window.location.hash)],
  initialIndex: 0,
});
// @endif
// @if TARGET='web'
history = createBrowserHistory();
// @endif

const triggerSharedStateActions = [
  ACTIONS.CHANNEL_SUBSCRIBE,
  ACTIONS.CHANNEL_UNSUBSCRIBE,
  ACTIONS.TOGGLE_BLOCK_CHANNEL,
  ACTIONS.ADD_COIN_SWAP,
  ACTIONS.REMOVE_COIN_SWAP,
  ACTIONS.TOGGLE_TAG_FOLLOW,
  ACTIONS.CREATE_CHANNEL_COMPLETED,
  ACTIONS.SYNC_CLIENT_SETTINGS,
  // Disabled until we can overwrite preferences
  ACTIONS.SHARED_PREFERENCE_SET,
  ACTIONS.COLLECTION_EDIT,
  ACTIONS.COLLECTION_DELETE,
  ACTIONS.COLLECTION_NEW,
  ACTIONS.COLLECTION_PENDING,
  ACTIONS.SET_LAST_VIEWED_ANNOUNCEMENT,
  // MAYBE COLLECTOIN SAVE
  // ACTIONS.SET_WELCOME_VERSION,
  // ACTIONS.SET_ALLOW_ANALYTICS,
];

/**
 * source: the reducer name
 * property: the property in the reducer-specific state
 * transform: optional method to modify the value to be stored
 *
 * See https://github.com/lbryio/lbry-redux/blob/master/src/redux/middleware/shared-state.js for the source
 * This is based off v0.1
 * If lbry-redux changes to another version, this code will need to be changed when upgrading
 */
const sharedStateFilters = {
  tags: { source: 'tags', property: 'followedTags' },
  subscriptions: {
    source: 'subscriptions',
    property: 'subscriptions',
    transform: (value) => {
      return value.map(({ uri }) => uri);
    },
  },
  following: {
    source: 'subscriptions',
    property: 'following',
  },
  blocked: { source: 'blocked', property: 'blockedChannels' },
  coin_swap_codes: {
    source: 'coinSwap',
    property: 'coinSwaps',
    transform: (coinSwaps) => {
      return coinSwaps.map((coinSwapInfo) => coinSwapInfo.chargeCode);
    },
  },
  settings: { source: 'settings', property: 'sharedPreferences' },
  app_welcome_version: { source: 'app', property: 'welcomeVersion' },
  sharing_3P: { source: 'app', property: 'allowAnalytics' },
  builtinCollections: { source: 'collections', property: 'builtin' },
  editedCollections: { source: 'collections', property: 'edited' },
  // savedCollections: { source: 'collections', property: 'saved' },
  unpublishedCollections: { source: 'collections', property: 'unpublished' },
  lastViewedAnnouncement: { source: 'content', property: 'lastViewedAnnouncement' },
};

const sharedStateCb = ({ dispatch, getState, syncId }) => {
  dispatch(doSyncLoop(false, syncId));
};

const populateAuthTokenHeader = () => {
  return (next) => (action) => {
    if (
      (action.type === ACTIONS.USER_FETCH_SUCCESS || action.type === ACTIONS.AUTHENTICATION_SUCCESS) &&
      action.data.user.has_verified_email === true
    ) {
      const authToken = getAuthToken();
      Lbry.setApiHeader(X_LBRY_AUTH_TOKEN, authToken);
    }

    return next(action);
  };
};

const sharedStateMiddleware = buildSharedStateMiddleware(triggerSharedStateActions, sharedStateFilters, sharedStateCb);
const rootReducer = createRootReducer(history);
const persistedReducer = persistReducer(persistOptions, rootReducer);
const bulkThunk = createBulkThunkMiddleware();
const analyticsMiddleware = createAnalyticsMiddleware();

const middleware = [
  sharedStateMiddleware,
  // @if TARGET='web'
  populateAuthTokenHeader,
  // @endif
  routerMiddleware(history),
  thunk,
  bulkThunk,
  analyticsMiddleware,
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  enableBatching(persistedReducer),
  {}, // initial state
  composeEnhancers(applyMiddleware(...middleware))
);

const persistor = persistStore(store);
window.persistor = persistor;

window.addEventListener('storage', (e) => {
  if (e.key === ACTIONS.SET_CONTENT_POSITION) {
    store.dispatch({
      type: ACTIONS.SET_CONTENT_POSITION,
      data: JSON.parse(e.newValue),
    });
  }
});

export { store, persistor, history, whiteListedReducers };
