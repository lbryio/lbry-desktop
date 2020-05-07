const config = require('../../config');
const { formatInAppUrl } = require('../../ui/util/url');

async function redirectMiddleware(ctx, next) {
  const requestHost = ctx.host;
  const path = ctx.path;
  const url = ctx.url;
  // Getting err: too many redirects on some urls because of this
  // Need a better solution
  // const decodedUrl = decodeURIComponent(url);

  // if (decodedUrl !== url) {
  //   ctx.redirect(decodedUrl);
  //   return;
  // }

  if (path.endsWith('/') && path.length > 1) {
    ctx.redirect(url.replace(/\/$/, ''));
    return;
  }

  if (!path.startsWith('/$/') && path.match(/^([^@/:]+)\/([^:/]+)$/)) {
    ctx.redirect(url.replace(/^([^@/:]+)\/([^:/]+)(:(\/.*))/, '$1:$2')); // test against path, but use ctx.url to retain parameters
    return;
  }

  if (requestHost === 'open.lbry.com' || requestHost === 'open.lbry.io') {
    const openQuery = '?src=open';
    let redirectUrl = config.URL + formatInAppUrl(url, openQuery);

    if (redirectUrl.includes('?')) {
      redirectUrl = redirectUrl.replace('?', `${openQuery}&`);
    } else {
      redirectUrl += openQuery;
    }

    ctx.redirect(redirectUrl);
    return;
  }

  // No redirects needed
  await next();
}

module.exports = redirectMiddleware;
