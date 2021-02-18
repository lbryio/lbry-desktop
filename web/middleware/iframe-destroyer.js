const PAGES = require('../../ui/constants/pages');

async function iframeDestroyerMiddleware(ctx, next) {
  const {
    request: { path },
  } = ctx;

  if (!path.startsWith(`/$/${PAGES.EMBED}`)) {
    ctx.set('X-Frame-Options', 'DENY');
  }

  return next();
}

module.exports = iframeDestroyerMiddleware;
