const config = {
  WEBPACK_WEB_PORT: 9090, // Also hardcoded in static/index.dev-web.html
  WEBPACK_ELECTRON_PORT: 9091, // Also hardcoded in static/index.dev-electron.html
  WEB_SERVER_PORT: 1337,
  DOMAIN: 'https://beta.lbry.tv',
};

config.DOMAIN_LOCAL = `http://localhost:${config.WEB_SERVER_PORT}`;
config.DOMAIN_DEV = `http://localhost:${config.WEBPACK_WEB_PORT}`;

module.exports = config;
