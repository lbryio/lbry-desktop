const PAGES = require('../../ui/constants/pages');
// const config = require('../../config');

function formatInAppUrl(path) {
  // Determine if we need to add a leading "/$/" for app pages
  const APP_PAGE_REGEX = /(\?)([a-z]*)(.*)/;
  const appPageMatches = APP_PAGE_REGEX.exec(path);

  if (appPageMatches && appPageMatches.length) {
    // Definitely an app page (or it's formatted like one)
    const [, , page, queryString] = appPageMatches;

    if (Object.values(PAGES).includes(page)) {
      let actualUrl = '/$/' + page;

      if (queryString) {
        actualUrl += `?${queryString.slice(1)}`;
      }

      return actualUrl;
    }
  }

  // Regular claim url
  return path;
}

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

  if (!path.startsWith('/$/') && path.match(/^([^@/:]+)\/([^:/]+)$/)) {
    ctx.redirect(url.replace(/^([^@/:]+)\/([^:/]+)(:(\/.*))/, '$1:$2')); // test against path, but use ctx.url to retain parameters
    return;
  }

  if (requestHost === 'open.lbry.com' || requestHost === 'open.lbry.io') {
    const openQuery = '?src=open';
    // let redirectUrl = config.URL + formatInAppUrl(url);
    // Blame tom for this, not me
    let redirectUrl = 'https://odysee.com' + formatInAppUrl(url);

    if (redirectUrl.includes('?')) {
      redirectUrl = redirectUrl.replace('?', `${openQuery}&`);
    } else {
      redirectUrl += openQuery;
    }
    ctx.status = 301;
    ctx.redirect(redirectUrl);
    return;
  }

  // No redirects needed
  await next();
}

module.exports = redirectMiddleware;
