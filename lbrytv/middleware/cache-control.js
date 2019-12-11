const SIX_MONTHS_IN_SECONDS = 15552000;

const STATIC_ASSET_PATHS = [
  '/public/font/font-v1.css',
  '/public/font/v1/300.woff',
  '/public/font/v1/300i.woff',
  '/public/font/v1/400.woff',
  '/public/font/v1/400i.woff',
  '/public/font/v1/700.woff',
  '/public/font/v1/700i.woff',
  '/public/favicon.png',
  '/public/img/busy.gif',
  '/public/img/gerbil-happy.png',
  '/public/img/gerbil-sad.png',
  '/public/img/placeholder.png',
  '/public/img/thumbnail-broken.png',
  '/public/img/thumbnail-missing.png',
  '/public/img/total-background.png',
];

async function redirectMiddleware(ctx, next) {
  const {
    request: { url },
  } = ctx;

  if (STATIC_ASSET_PATHS.includes(url)) {
    ctx.set('Cache-Control', `public, max-age=${SIX_MONTHS_IN_SECONDS}`);
  }

  return next();
}

module.exports = redirectMiddleware;
