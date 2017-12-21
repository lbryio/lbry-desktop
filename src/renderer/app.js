import store from 'store';
import { remote } from 'electron';
import path from 'path';
import y18n from 'y18n';

const env = process.env.NODE_ENV || 'production';
const config = {
  ...import(`./config/${env}`),
};
const i18n = y18n({
  directory: path.join(remote.app.getAppPath(), '/../static/locales').replace(/\\/g, '\\\\'),
  updateFiles: false,
  locale: 'en',
});

const logs = [];
const app = {
  env,
  config,
  store,
  i18n,
  logs,
  log(message) {
    logs.push(message);
  },
};

// Workaround for https://github.com/electron-userland/electron-webpack/issues/52
if (env !== 'development') {
  window.staticResourcesPath = path
    .join(remote.app.getAppPath(), '../static')
    .replace(/\\/g, '\\\\');
} else {
  window.staticResourcesPath = '';
}

// eslint-disable-next-line no-underscore-dangle
window.__ = i18n.__;
// eslint-disable-next-line no-underscore-dangle
window.__n = i18n.__n;
window.app = app;
