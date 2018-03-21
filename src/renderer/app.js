import store from 'store';
import { remote } from 'electron';
import Path from 'path';
import y18n from 'y18n';
import isDev from 'electron-is-dev';

const env = process.env.NODE_ENV || 'production';
const i18n = y18n({
  directory: Path.join(remote.app.getAppPath(), '/../static/locales').replace(/\\/g, '\\\\'),
  updateFiles: false,
  locale: 'en',
});

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

// Workaround for https://github.com/electron-userland/electron-webpack/issues/52
if (!isDev) {
  window.staticResourcesPath = Path.join(remote.app.getAppPath(), '../static').replace(
    /\\/g,
    '\\\\'
  );
} else {
  window.staticResourcesPath = '';
}

// eslint-disable-next-line no-underscore-dangle
global.__ = i18n.__;
// eslint-disable-next-line no-underscore-dangle
global.__n = i18n.__n;
global.app = app;

export default app;
