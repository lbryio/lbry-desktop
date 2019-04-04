import { persistStore, autoRehydrate } from 'redux-persist';
import createCompressor from 'redux-persist-transform-compress';
import createFilter from 'redux-persist-transform-filter';
import localForage from 'localforage';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory, createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';

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

// @if TARGET='app'
const history = createHashHistory();
// @endif
// @if TARGET='web'
const history = createBrowserHistory();
// @endif
const bulkThunk = createBulkThunkMiddleware();
const middleware = [routerMiddleware(history), thunk, bulkThunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  enableBatching(createRootReducer(history)),
  {}, // initial state
  composeEnhancers(
    autoRehydrate({
      log: app.env === 'development',
    }),
    applyMiddleware(...middleware)
  )
);

const compressor = createCompressor();
// Removing claims from redux-persist to see if it solves https://github.com/lbryio/lbry-desktop/issues/1983
// We were caching so much data the app was locking up
// We can't add this back until we can perform this in a non-blocking way
// const saveClaimsFilter = createFilter('claims', ['byId', 'claimsByUri']);
const contentFilter = createFilter('content', ['positions', 'history']);
const fileInfoFilter = createFilter('fileInfo', [
  'fileListPublishedSort',
  'fileListDownloadedSort',
  'fileListSubscriptionSort',
]);
const appFilter = createFilter('app', ['hasClickedComment', 'searchOptionsExpanded']);
// We only need to persist the receiveAddress for the wallet
const walletFilter = createFilter('wallet', ['receiveAddress']);
const searchFilter = createFilter('search', ['options']);

const persistOptions = {
  whitelist: ['subscriptions', 'publish', 'wallet', 'content', 'fileInfo', 'app', 'search'],
  // Order is important. Needs to be compressed last or other transforms can't
  // read the data
  transforms: [walletFilter, contentFilter, fileInfoFilter, appFilter, searchFilter, compressor],
  debounce: 10000,
  storage: localForage,
};

// Dont' persist anything on web (for now)
// @if TARGET='app'
window.cacheStore = persistStore(store, persistOptions, err => {
  if (err) {
    console.error('Unable to load saved settings');
  }
});
// @endif

export { store, history };
