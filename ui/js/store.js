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

const reducers = redux.combineReducers({
  app: appReducer,
  content: contentReducer,
  rewards: rewardsReducer,
  search: searchReducer,
  wallet: walletReducer,
});

var middleware = [thunk]

if (env === 'development') {
  const logger = createLogger({
    collapsed: true
  });
  middleware.push(logger)
}

const createStoreWithMiddleware = redux.compose(
  redux.applyMiddleware(...middleware)
)(redux.createStore);

const reduxStore = createStoreWithMiddleware(reducers);

export default reduxStore;
