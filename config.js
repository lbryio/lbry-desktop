const config = {
  WEBPACK_WEB_PORT: 9090,
  WEBPACK_ELECTRON_PORT: 9091,
  WEB_SERVER_PORT: 1337,
  DOMAIN: 'https://beta.lbry.tv',
  SITE_TITLE: 'lbry.tv',
  LBRY_TV_API: 'https://api.lbry.tv',
};

config.DOMAIN_LOCAL = `http://localhost:${config.WEB_SERVER_PORT}`;
config.DOMAIN_DEV = `http://localhost:${config.WEBPACK_WEB_PORT}`;

module.exports = config;
