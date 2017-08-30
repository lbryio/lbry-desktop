import store from "store.js";
import lbry from "./lbry.js";
import * as settings from "constants/settings";

const env = ENV;
const config = {
  ...require(`./config/${env}`),
};
const language = lbry.getClientSetting(settings.LANGUAGE)
  ? lbry.getClientSetting(settings.LANGUAGE)
  : "en";
const i18n = require("y18n")({
  directory: "app/locales",
  updateFiles: false,
  locale: language,
});
const logs = [];
const app = {
  env: env,
  config: config,
  store: store,
  i18n: i18n,
  logs: logs,
  log: function(message) {
    logs.push(message);
  },
};

window.__ = i18n.__;
window.__n = i18n.__n;

global.app = app;
module.exports = app;
