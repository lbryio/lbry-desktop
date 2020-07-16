// On Web, this will find .env.defaults and optional .env in web/
// On Desktop App, this will find .env.defaults and optional .env in root dir
require('dotenv-defaults').config({ silent: false });

const config = {
  MATOMO_URL: process.env.MATOMO_URL,
  MATOMO_ID: process.env.MATOMO_ID,
  WEBPACK_WEB_PORT: process.env.WEBPACK_WEB_PORT,
  WEBPACK_ELECTRON_PORT: process.env.WEBPACK_ELECTRON_PORT,
  WEB_SERVER_PORT: process.env.WEB_SERVER_PORT,
  LBRY_WEB_API: process.env.LBRY_WEB_API, //api.lbry.tv',
  LBRY_WEB_STREAMING_API: process.env.LBRY_WEB_STREAMING_API, //cdn.lbryplayer.xyz',
  WELCOME_VERSION: process.env.WELCOME_VERSION,
  DOMAIN: process.env.DOMAIN,
  URL: process.env.URL,
  SITE_TITLE: process.env.SITE_TITLE,
  SITE_NAME: process.env.SITE_NAME,
  SITE_DESCRIPTION: process.env.SITE_DESCRIPTION,
  LOGO_TITLE: process.env.LOGO_TITLE,
  OG_TITLE_SUFFIX: process.env.OG_TITLE_SUFFIX,
  OG_HOMEPAGE_TITLE: process.env.OG_HOMEPAGE_TITLE,
  OG_IMAGE_URL: process.env.OG_IMAGE_URL,
  SITE_CANONICAL_URL: process.env.SITE_CANONICAL_URL,
  DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE,

  PINNED_URI_1: process.env.PINNED_URI_1,
  PINNED_LABEL_1: process.env.PINNED_LABEL_1,
  PINNED_URI_2: process.env.PINNED_URI_2,
  PINNED_LABEL_2: process.env.PINNED_LABEL_2,
};

config.URL_LOCAL = `http://localhost:${config.WEB_SERVER_PORT}`;
config.URL_DEV = `http://localhost:${config.WEBPACK_WEB_PORT}`;

module.exports = config;
