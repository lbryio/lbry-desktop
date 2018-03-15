import { createLogger } from 'redux-logger';
import appReducer from 'redux/reducers/app';
import availabilityReducer from 'redux/reducers/availability';
import claimsReducer from 'redux/reducers/claims';
import contentReducer from 'redux/reducers/content';
import costInfoReducer from 'redux/reducers/cost_info';
import fileInfoReducer from 'redux/reducers/file_info';
import navigationReducer from 'redux/reducers/navigation';
import rewardsReducer from 'redux/reducers/rewards';
import searchReducer from 'redux/reducers/search';
import settingsReducer from 'redux/reducers/settings';
import userReducer from 'redux/reducers/user';
import walletReducer from 'redux/reducers/wallet';
import shapeShiftReducer from 'redux/reducers/shape_shift';
import subscriptionsReducer from 'redux/reducers/subscriptions';
import mediaReducer from 'redux/reducers/media';
import uploadReducer from "redux/reducers/upload";
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
  media: mediaReducer,
  upload: uploadReducer,
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

const persistOptions = {
  whitelist: ['claims', 'subscriptions'],
  // Order is important. Needs to be compressed last or other transforms can't
  // read the data
  transforms: [saveClaimsFilter, subscriptionsFilter, compressor],
  debounce: 10000,
  storage: localForage,
};

window.cacheStore = persistStore(store, persistOptions, err => {
  if (err) {
    console.error('Unable to load saved SETTINGS');
  }
});

export default store;
