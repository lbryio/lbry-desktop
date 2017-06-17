import { createLogger } from "redux-logger";
import appReducer from "reducers/app";
import availabilityReducer from "reducers/availability";
import claimsReducer from "reducers/claims";
import contentReducer from "reducers/content";
import costInfoReducer from "reducers/cost_info";
import fileInfoReducer from "reducers/file_info";
import rewardsReducer from "reducers/rewards";
import searchReducer from "reducers/search";
import settingsReducer from "reducers/settings";
import userReducer from "reducers/user";
import walletReducer from "reducers/wallet";
import { persistStore, autoRehydrate } from "redux-persist";
import createCompressor from "redux-persist-transform-compress";
import createFilter from "redux-persist-transform-filter";
import { REHYDRATE } from "redux-persist/constants";
import createActionBuffer from "redux-action-buffer";

const localForage = require("localforage");
const redux = require("redux");
const thunk = require("redux-thunk").default;
const env = ENV;

function isFunction(object) {
  return typeof object === "function";
}

function isNotFunction(object) {
  return !isFunction(object);
}

function createBulkThunkMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    if (action.type === "BATCH_ACTIONS") {
      action.actions
        .filter(isFunction)
        .map(actionFn => actionFn(dispatch, getState));
    }
    return next(action);
  };
}

function enableBatching(reducer) {
  return function batchingReducer(state, action) {
    switch (action.type) {
      case "BATCH_ACTIONS":
        return action.actions
          .filter(isNotFunction)
          .reduce(batchingReducer, state);
      default:
        return reducer(state, action);
    }
  };
}

const reducers = redux.combineReducers({
  app: appReducer,
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
});

const bulkThunk = createBulkThunkMiddleware();
const middleware = [thunk, bulkThunk];

if (env === "development") {
  const logger = createLogger({
    collapsed: true,
  });
  middleware.push(logger);
}

// middleware.push(createActionBuffer(REHYDRATE)); // was causing issues with authentication reducers not firing

const createStoreWithMiddleware = redux.compose(
  autoRehydrate(),
  redux.applyMiddleware(...middleware)
)(redux.createStore);

const reduxStore = createStoreWithMiddleware(enableBatching(reducers));
const compressor = createCompressor();
const saveClaimsFilter = createFilter("claims", [
  "byId",
  "claimsByUri",
  "myClaims",
  "myChannelClaims",
]);
const saveFileInfosFilter = createFilter("fileInfo", [
  "fileInfos",
  "pendingByOutpoint",
]);

const persistOptions = {
  whitelist: ["claims", "fileInfo"],
  // Order is important. Needs to be compressed last or other transforms can't
  // read the data
  transforms: [saveClaimsFilter, saveFileInfosFilter, compressor],
  debounce: 1000,
  storage: localForage,
};
window.cacheStore = persistStore(reduxStore, persistOptions);

export default reduxStore;
