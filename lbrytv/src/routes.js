const { getHtml } = require('./html');
const { generateStreamUrl, generateDownloadUrl } = require('../../ui/util/lbrytv');
const { LBRY_TV_API } = require('../../config');
const Router = require('@koa/router');
const send = require('koa-send');

const router = new Router();

router.get(`/$/embed/:claimName/:claimId`, async ctx => {
  const { claimName, claimId } = ctx.params;
  const streamUrl = generateStreamUrl(claimName, claimId, LBRY_TV_API);
  ctx.redirect(streamUrl);
});

router.get(`/$/download/:claimName/:claimId`, async ctx => {
  const { claimName, claimId } = ctx.params;
  const downloadUrl = generateDownloadUrl(claimName, claimId, LBRY_TV_API);
  ctx.redirect(downloadUrl);
});

router.get('*', async ctx => {
  const html = await getHtml(ctx);
  ctx.body = html;
});

module.exports = router;
