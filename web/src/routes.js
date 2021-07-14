const { getHtml } = require('./html');
const { getRss } = require('./rss');
const { getHomepageJSON } = require('./getHomepageJSON');
const { generateStreamUrl } = require('../../ui/util/web');
const fetch = require('node-fetch');
const Router = require('@koa/router');
const { CUSTOM_HOMEPAGE } = require('../../config.js');

// So any code from 'lbry-redux'/'lbryinc' that uses `fetch` can be run on the server
global.fetch = fetch;

const router = new Router();

function getStreamUrl(ctx) {
  const { claimName, claimId } = ctx.params;

  const streamUrl = generateStreamUrl(claimName, claimId);
  return streamUrl;
}

const rssMiddleware = async (ctx) => {
  const xml = await getRss(ctx);
  ctx.set('Content-Type', 'application/rss+xml');
  ctx.body = xml;
};

router.get(`/$/api/content/v1/get`, async (ctx) => {
  if (!CUSTOM_HOMEPAGE) {
    ctx.status = 404;
    ctx.body = {
      message: 'Not Found',
    };
  } else {
    let content;
    try {
      content = getHomepageJSON();
      ctx.set('Content-Type', 'application/json');
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
});

router.get(`/$/download/:claimName/:claimId`, async (ctx) => {
  const streamUrl = getStreamUrl(ctx);
  const downloadUrl = `${streamUrl}?download=1`;
  ctx.redirect(downloadUrl);
});

router.get(`/$/stream/:claimName/:claimId`, async (ctx) => {
  const streamUrl = getStreamUrl(ctx);
  ctx.redirect(streamUrl);
});

router.get(`/$/rss/:claimName/:claimId`, rssMiddleware);
router.get(`/$/rss/:claimName::claimId`, rssMiddleware);

router.get('*', async (ctx) => {
  const html = await getHtml(ctx);
  ctx.body = html;
});

module.exports = router;
