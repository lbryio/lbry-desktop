import { persistStore, persistReducer } from 'redux-persist';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from './reducers';
import { createAnalyticsMiddleware } from 'redux/middleware/analytics';
import { populateAuthTokenHeader } from 'redux/middleware/auth-token';
import { createBulkThunkMiddleware, enableBatching } from 'redux/middleware/batch-actions';
import { initTabStateSync } from 'redux/middleware/tab-sync';

import { persistOptions } from 'redux/setup/persistedState';
import { sharedStateMiddleware } from 'redux/setup/sharedState';
import { tabStateSyncMiddleware } from 'redux/setup/tabState';

const history = createBrowserHistory();
const rootReducer = createRootReducer(history);
const persistedReducer = persistReducer(persistOptions, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [
  sharedStateMiddleware,
  populateAuthTokenHeader,
  routerMiddleware(history),
  thunk,
  createBulkThunkMiddleware(), // BATCH_ACTIONS support
  createAnalyticsMiddleware(),
  tabStateSyncMiddleware,
];

const store = createStore(
  enableBatching(persistedReducer),
  {}, // initial state
  composeEnhancers(applyMiddleware(...middleware))
);

initTabStateSync(store);

const persistor = persistStore(store);
window.persistor = persistor;

export { store, persistor, history };
