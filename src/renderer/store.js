import { createLogger } from 'redux-logger';
import appReducer from 'redux/reducers/app';
import availabilityReducer from 'redux/reducers/availability';
import contentReducer from 'redux/reducers/content';
import {
  claimsReducer,
  costInfoReducer,
  fileInfoReducer,
  searchReducer,
  walletReducer,
  notificationsReducer,
  blacklistReducer,
} from 'lbry-redux';
import navigationReducer from 'redux/reducers/navigation';
import settingsReducer from 'redux/reducers/settings';
import { userReducer, rewardsReducer } from 'lbryinc';
import shapeShiftReducer from 'redux/reducers/shape_shift';
import subscriptionsReducer from 'redux/reducers/subscriptions';
import publishReducer from 'redux/reducers/publish';
import { persistStore, autoRehydrate } from 'redux-persist';
import createCompressor from 'redux-persist-transform-compress';
import createFilter from 'redux-persist-transform-filter';
import localForage from 'localforage';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

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

const reducers = combineReducers({
  app: appReducer,
  navigation: navigationReducer,
  availability: availabilityReducer,
  claims: claimsReducer,
  fileInfo: fileInfoReducer,
  content: contentReducer,
  costInfo: costInfoReducer,
  rewards: rewardsReducer,
  search: searchReducer,
  settings: settingsReducer,
  wallet: walletReducer,
  user: userReducer,
  shapeShift: shapeShiftReducer,
  subscriptions: subscriptionsReducer,
  publish: publishReducer,
  notifications: notificationsReducer,
  blacklist: blacklistReducer,
});

const bulkThunk = createBulkThunkMiddleware();
const middleware = [thunk, bulkThunk];

if (app.env === 'development') {
  const logger = createLogger({
    collapsed: true,
  });
  middleware.push(logger);
}

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  enableBatching(reducers),
  {}, // initial state
  composeEnhancers(
    autoRehydrate({
      log: app.env === 'development',
    }),
    applyMiddleware(...middleware)
  )
);

const compressor = createCompressor();
const saveClaimsFilter = createFilter('claims', ['byId', 'claimsByUri']);
const subscriptionsFilter = createFilter('subscriptions', ['subscriptions']);
const contentFilter = createFilter('content', ['positions', 'history']);

// We only need to persist the receiveAddress for the wallet
const walletFilter = createFilter('wallet', ['receiveAddress']);

const persistOptions = {
  whitelist: ['claims', 'subscriptions', 'publish', 'wallet', 'content'],
  // Order is important. Needs to be compressed last or other transforms can't
  // read the data
  transforms: [saveClaimsFilter, subscriptionsFilter, walletFilter, contentFilter, compressor],
  debounce: 10000,
  storage: localForage,
};

window.cacheStore = persistStore(store, persistOptions, err => {
  if (err) {
    console.error('Unable to load saved settings'); // eslint-disable-line no-console
  }
});

export default store;
