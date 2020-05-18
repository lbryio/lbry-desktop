// On Web, this will find .env.defaults and optional .env in web/
// On Desktop App, this will find .env.defaults and optional .env in root dir
require('dotenv-defaults').config({silent: false});
const config = {
  WEBPACK_WEB_PORT: process.env.WEBPACK_WEB_PORT,
  WEBPACK_ELECTRON_PORT: process.env.WEBPACK_ELECTRON_PORT,
  WEB_SERVER_PORT: process.env.WEB_SERVER_PORT,
  DOMAIN: process.env.DOMAIN,
  URL: process.env.URL, //lbry.tv',
  SITE_TITLE: process.env.SITE_TITLE,
  LBRY_WEB_API: process.env.LBRY_WEB_API, //api.lbry.tv',
  LBRY_WEB_STREAMING_API: process.env.LBRY_WEB_STREAMING_API, //cdn.lbryplayer.xyz',
  WELCOME_VERSION: process.env.WELCOME_VERSION,
  DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE,
  LOGO_TITLE: process.env.LOGO_TITLE,
};

config.URL_LOCAL = `http://localhost:${config.WEB_SERVER_PORT}`;
config.URL_DEV = `http://localhost:${config.WEBPACK_WEB_PORT}`;

module.exports = config;
