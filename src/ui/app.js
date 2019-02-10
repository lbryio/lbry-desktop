import store from 'store';
import { remote } from 'electron';
import Path from 'path';
import isDev from 'electron-is-dev';

const env = process.env.NODE_ENV || 'production';

const logs = [];
const app = {
  env,
  store,
  logs,
  log(message) {
    logs.push(message);
  },
};

global.app = app;

// Lbryinc needs access to the redux store for dispatching auth-releated actions
global.store = app.store;

export default app;
