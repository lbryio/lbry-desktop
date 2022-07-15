const { fetchStreamUrl } = require('./fetchStreamUrl');
const { getHomepage } = require('./homepageApi');
const { getHtml } = require('./html');
const { getMinVersion } = require('./minVersion');
const { getOEmbed } = require('./oEmbed');
const { getRss } = require('./rss');
const { getTempFile } = require('./tempfile');

const fetch = require('node-fetch');
const Router = require('@koa/router');

// So any code from 'lbry-redux'/'lbryinc' that uses `fetch` can be run on the server
global.fetch = fetch;

const router = new Router();

async function getStreamUrl(ctx) {
  const { claimName, claimId } = ctx.params;
  return await fetchStreamUrl(claimName, claimId);
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

router.get(`/$/minVersion/v1/get`, async (ctx) => getMinVersion(ctx));

router.get(`/$/api/content/v1/get`, async (ctx) => getHomepage(ctx, 1));
router.get(`/$/api/content/v2/get`, async (ctx) => getHomepage(ctx, 2));

router.get(`/$/download/:claimName/:claimId`, async (ctx) => {
  const streamUrl = await getStreamUrl(ctx);
  if (streamUrl) {
    const downloadUrl = `${streamUrl}?download=1`;
    ctx.redirect(downloadUrl);
  }
});

router.get(`/$/stream/:claimName/:claimId`, async (ctx) => {
  const streamUrl = await getStreamUrl(ctx);
  if (streamUrl) {
    ctx.redirect(streamUrl);
  }
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
