const THREE_MONTHS_IN_SECONDS = 7776000;

async function redirectMiddleware(ctx, next) {
  const {
    request: { url },
  } = ctx;

  if (url.includes('.png') || url.includes('font.css') || url.includes('.woff')) {
    ctx.set('Cache-Control', `public, max-age=${THREE_MONTHS_IN_SECONDS}`);
  }

  return next();
}

module.exports = redirectMiddleware;
