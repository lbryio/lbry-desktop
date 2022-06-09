const { CUSTOM_HOMEPAGE } = require('../../config');
const { getHomepageJsonV1, getHomepageJsonV2 } = require('./getHomepageJSON');

async function getHomepage(ctx, version) {
  if (!CUSTOM_HOMEPAGE) {
    ctx.status = 404;
    ctx.body = { message: 'Not Found' };
    return;
  }

  const format = ctx?.request?.query?.format;

  try {
    const content = version === 1 ? getHomepageJsonV1() : getHomepageJsonV2(format);
    ctx.set('Content-Type', 'application/json');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.body = {
      status: 'success',
      data: content,
    };
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
    };
  }
}

module.exports = { getHomepage };
