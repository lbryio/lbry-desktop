const config = require('../../config');
const redirectHosts = ['open.lbry.com'];

async function redirectMiddleware(ctx, next) {
  const requestHost = ctx.host;
  const path = ctx.path;
  const url = ctx.url;

  if (urlPath.endsWith('/') && urlPath.length > 1) {
    ctx.redirect(url.replace(/\/$/, ''));
    return;
  }

  if (!path.startsWith('/$/') && path.match(/^([^@/:]+)\/([^:/]+)$/)) {
    ctx.redirect(url.replace(/^([^@/:]+)\/([^:/]+)(:(\/.*))/, '$1:$2')); // test against path, but use ctx.url to retain parameters
    return;
  }

  if (redirectHosts.includes(requestHost)) {
    const redirectUrl = config.DOMAIN + path;
    ctx.redirect(redirectUrl);
    return;
  }

  // No redirects needed
  await next();
}

module.exports = redirectMiddleware;
