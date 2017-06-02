import store from 'store.js';
import lbry from './lbry.js';

const env = ENV;
const config = require(`./config/${env}`);
const i18n = require('y18n')
const logs = [];
const app = {
  env: env,
  config: config,
  store: store,
  i18n: i18n,
  logs: logs,
  log: function(message) {
    console.log(message);
    logs.push(message);
  }
}

window.__ = i18n.__;
window.__n = i18n.__n;

global.app = app;
module.exports = app;
