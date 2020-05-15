const config = {
  WEBPACK_WEB_PORT: 9090,
  WEBPACK_ELECTRON_PORT: 9091,
  WEB_SERVER_PORT: 1337,
  DOMAIN: 'lbry.tv',
  URL: 'https://lbry.tv',
  SITE_TITLE: 'lbry.tv',
  LBRY_TV_API: 'https://api.ops.lbry.tv',
  LBRY_TV_STREAMING_API: 'https://cdn.lbryplayer.xyz',
  WELCOME_VERSION: 1.0,
};

config.URL_LOCAL = `http://localhost:${config.WEB_SERVER_PORT}`;
config.URL_DEV = `http://localhost:${config.WEBPACK_WEB_PORT}`;

module.exports = config;
