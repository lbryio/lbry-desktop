const { CUSTOM_HOMEPAGE } = require('../../config.js');
const { generateStreamUrl } = require('../../ui/util/web');
const { getHomepageJSON } = require('./getHomepageJSON');
const { getHtml } = require('./html');
const { getOEmbed } = require('./oEmbed');
const { getRss } = require('./rss');
const { getTempFile } = require('./tempfile');

const fetch = require('node-fetch');
const Router = require('@koa/router');

// So any code from 'lbry-redux'/'lbryinc' that uses `fetch` can be run on the server
global.fetch = fetch;

const router = new Router();

function getStreamUrl(ctx) {
  const { claimName, claimId } = ctx.params;

  const streamUrl = generateStreamUrl(claimName, claimId);
  return streamUrl;
}

const rssMiddleware = async (ctx) => {
  const rss = await getRss(ctx);
  if (rss.startsWith('<?xml')) {
    ctx.set('Content-Type', 'application/xml');
  }
  ctx.body = rss;
};

const oEmbedMiddleware = async (ctx) => {
  const oEmbed = await getOEmbed(ctx);
  ctx.body = oEmbed;
};

const tempfileMiddleware = async (ctx) => {
  const temp = await getTempFile(ctx);
  ctx.body = temp;
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

router.get(`/$/activate`, async (ctx) => {
  ctx.redirect(`https://sso.odysee.com/auth/realms/Users/device`);
});
// to add a path for a temp file on the server, customize this path
router.get('/.well-known/:filename', tempfileMiddleware);

router.get(`/$/rss/:claimName/:claimId`, rssMiddleware);
router.get(`/$/rss/:claimName::claimId`, rssMiddleware);

router.get(`/$/oembed`, oEmbedMiddleware);

router.get('*', async (ctx) => {
  const html = await getHtml(ctx);
  ctx.body = html;
});

module.exports = router;
