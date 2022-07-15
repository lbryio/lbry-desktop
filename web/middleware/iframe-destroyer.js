const PAGES = require('../../ui/constants/pages');

async function iframeDestroyerMiddleware(ctx, next) {
  const {
    request: { path },
  } = ctx;
  const decodedPath = decodeURIComponent(path);

  if (!(decodedPath.startsWith(`/$/${PAGES.EMBED}`) || decodedPath.startsWith(`/$/api/content/v1/get`))) {
    ctx.set('X-Frame-Options', 'DENY');
  }

  return next();
}

module.exports = iframeDestroyerMiddleware;
