const config = require('../../config');
const PAGES = require('../../ui/constants/pages');

async function redirectMiddleware(ctx, next) {
  const requestHost = ctx.host;
  const path = ctx.path;
  const url = ctx.url;

  if (path.endsWith('/') && path.length > 1) {
    ctx.redirect(url.replace(/\/$/, ''));
    return;
  }

  if (!path.startsWith('/$/') && path.match(/^([^@/:]+)\/([^:/]+)$/)) {
    ctx.redirect(url.replace(/^([^@/:]+)\/([^:/]+)(:(\/.*))/, '$1:$2')); // test against path, but use ctx.url to retain parameters
    return;
  }

  if (requestHost === 'open.lbry.com') {
    let redirectUrl = config.URL;
    const openQuery = '?src=open';
    const matches = /(\/\?)([a-z]*)(.*)/.exec(url);

    if (matches && matches.length) {
      [, , page, queryString] = matches;

      // This is a lbry app page. Make sure to add the leading `/$/`
      if (page && Object.values(PAGES).includes(page)) {
        redirectUrl += '/$/' + page;
      }

      redirectUrl += openQuery + queryString;
    } else {
      redirectUrl += path + openQuery;
    }

    ctx.redirect(redirectUrl);
    return;
  }

  // No redirects needed
  await next();
}

module.exports = redirectMiddleware;
