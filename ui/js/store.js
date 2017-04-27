const redux = require('redux');
const thunk = require("redux-thunk").default;
const env = process.env.NODE_ENV || 'development';

import {
  createLogger
} from 'redux-logger'
import appReducer from 'reducers/app';
import contentReducer from 'reducers/content';
import rewardsReducer from 'reducers/rewards'
import searchReducer from 'reducers/search'
import walletReducer from 'reducers/wallet'

function isFunction(object) {
  return typeof object === 'function';
}

function isNotFunction(object) {
  return !isFunction(object);
}

function createBulkThunkMiddleware() {
  return ({ dispatch, getState }) => next => (action) => {
    if (action.type === 'BATCH_ACTIONS') {
      action.actions.filter(isFunction).map(actionFn =>
        actionFn(dispatch, getState)
      )
    }
    return next(action)
  }
}

function enableBatching(reducer) {
  return function batchingReducer(state, action) {
    switch (action.type) {
      case 'BATCH_ACTIONS':
        return action.actions.filter(isNotFunction).reduce(batchingReducer, state)
      default:
        return reducer(state, action)
    }
  }
}

const reducers = redux.combineReducers({
  app: appReducer,
  content: contentReducer,
  rewards: rewardsReducer,
  search: searchReducer,
  wallet: walletReducer,
});

const bulkThunk = createBulkThunkMiddleware()
const middleware = [thunk, bulkThunk]

if (env === 'development') {
  const logger = createLogger({
    collapsed: true
  });
  middleware.push(logger)
}

const createStoreWithMiddleware = redux.compose(
  redux.applyMiddleware(...middleware)
)(redux.createStore);

const reduxStore = createStoreWithMiddleware(enableBatching(reducers));

export default reduxStore;
