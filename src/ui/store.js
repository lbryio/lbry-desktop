import * as ACTIONS from 'constants/action_types';
import * as SETTINGS from 'constants/settings';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createCompressor from 'redux-persist-transform-compress';
import createFilter from 'redux-persist-transform-filter';
import localForage from 'localforage';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory, createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import { buildSharedStateMiddleware, ACTIONS as LBRY_REDUX_ACTIONS } from 'lbry-redux';
import { doGetSync, selectUserVerifiedEmail } from 'lbryinc';
import { getSavedPassword } from 'util/saved-passwords';
import { makeSelectClientSetting } from 'redux/selectors/settings';

function isFunction(object) {
  return typeof object === 'function';
}

function isNotFunction(object) {
  return !isFunction(object);
}

function createBulkThunkMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    if (action.type === 'BATCH_ACTIONS') {
      action.actions.filter(isFunction).map(actionFn => actionFn(dispatch, getState));
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

const contentFilter = createFilter('content', ['positions', 'history']);
const fileInfoFilter = createFilter('fileInfo', [
  'fileListPublishedSort',
  'fileListDownloadedSort',
  'fileListSubscriptionSort',
]);
const appFilter = createFilter('app', ['hasClickedComment', 'searchOptionsExpanded', 'volume', 'muted']);
// We only need to persist the receiveAddress for the wallet
const walletFilter = createFilter('wallet', ['receiveAddress']);
const searchFilter = createFilter('search', ['options']);
const tagsFilter = createFilter('tags', ['followedTags']);
const subscriptionsFilter = createFilter('subscriptions', ['subscriptions']);
const blockedFilter = createFilter('blocked', ['blockedChannels']);
const whiteListedReducers = [
  // @if TARGET='app'
  'publish',
  'wallet',
  'tags',
  // 'fileInfo',
  // @endif
  'content',
  'app',
  'search',
  'blocked',
  'settings',
  'subscriptions',
];

const transforms = [
  // @if TARGET='app'
  walletFilter,
  fileInfoFilter,
  blockedFilter,
  tagsFilter,
  // @endif
  appFilter,
  searchFilter,
  tagsFilter,
  contentFilter,
  subscriptionsFilter,
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
history = createHashHistory();
// @endif
// @if TARGET='web'
history = createBrowserHistory();
// @endif

const triggerSharedStateActions = [
  ACTIONS.CHANNEL_SUBSCRIBE,
  ACTIONS.CHANNEL_UNSUBSCRIBE,
  LBRY_REDUX_ACTIONS.TOGGLE_TAG_FOLLOW,
  LBRY_REDUX_ACTIONS.TOGGLE_BLOCK_CHANNEL,
  LBRY_REDUX_ACTIONS.CREATE_CHANNEL_COMPLETED,
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
    transform: function(value) {
      return value.map(({ uri }) => uri);
    },
  },
  blocked: { source: 'blocked', property: 'blockedChannels' },
};

const sharedStateCb = ({ dispatch, getState }) => {
  const state = getState();
  const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
  const emailVerified = selectUserVerifiedEmail(state);
  if (syncEnabled && emailVerified) {
    getSavedPassword().then(savedPassword => {
      dispatch(doGetSync(savedPassword));
    });
  }
};

const sharedStateMiddleware = buildSharedStateMiddleware(triggerSharedStateActions, sharedStateFilters, sharedStateCb);
const rootReducer = createRootReducer(history);
const persistedReducer = persistReducer(persistOptions, rootReducer);
const bulkThunk = createBulkThunkMiddleware();
const middleware = [sharedStateMiddleware, routerMiddleware(history), thunk, bulkThunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  enableBatching(persistedReducer),
  {}, // initial state
  composeEnhancers(applyMiddleware(...middleware))
);

const persistor = persistStore(store);
window.persistor = persistor;

export { store, persistor, history, whiteListedReducers };
