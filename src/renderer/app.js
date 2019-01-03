import store from 'store';
import Path from 'path';
// @if TARGET='app'
import y18n from 'y18n';
// @endif
// @if TARGET='web'
import { y18n } from '../web/stubs';
// @endif

// @if TARGET='app'
const env = process.env.NODE_ENV || 'production';
const i18n = y18n({
  directory: Path.join(remote.app.getAppPath(), '/../static/locales').replace(/\\/g, '\\\\'),
  updateFiles: false,
  locale: 'en',
});
// @endif
// @if TARGET='web'
const env = process.env.NODE_ENV || 'development';
const i18n = y18n({
  updateFiles: false,
  locale: 'en',
});
// @endif

const logs = [];
const app = {
  env,
  store,
  i18n,
  logs,
  log(message) {
    logs.push(message);
  },
};

// @if TARGET='app'
// Workaround for https://github.com/electron-userland/electron-webpack/issues/52
if (!isDev) {
  window.staticResourcesPath = Path.join(remote.app.getAppPath(), '../static').replace(
    /\\/g,
    '\\\\'
  );
} else {
  window.staticResourcesPath = '';
}
// @endif

// eslint-disable-next-line no-underscore-dangle
global.__ = i18n.__;
// eslint-disable-next-line no-underscore-dangle
global.__n = i18n.__n;
global.app = app;

// Lbryinc needs access to the redux store for dispatching auth-releated actions
global.store = app.store;

export default app;
