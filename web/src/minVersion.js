const { MINIMUM_VERSION } = require('../../config');

async function getMinVersion(ctx, version) {
  if (!MINIMUM_VERSION) {
    ctx.status = 404;
    ctx.body = { message: 'Not Found' };
    return;
  }

  try {
    ctx.set('Content-Type', 'application/json');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.body = {
      status: 'success',
      data: MINIMUM_VERSION,
    };
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
    };
  }
}

module.exports = { getMinVersion };
