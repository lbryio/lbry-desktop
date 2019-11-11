const config = require('../config');
const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const router = require('./src/routes');
const redirectMiddleware = require('./middleware/redirect');

const app = new Koa();
const DIST_ROOT = path.resolve(__dirname, 'dist');

app.use(logger());
app.use(redirectMiddleware);
app.use(serve(DIST_ROOT)); // Check if the request url matches any assets inside of /dist

app.use(router.routes());
app.listen(config.WEB_SERVER_PORT, () => `Server up at localhost:${config.WEB_SERVER_PORT}`);
