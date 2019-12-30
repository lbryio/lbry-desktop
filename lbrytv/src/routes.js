const { getHtml } = require('./html');
const { generateDownloadUrl } = require('../../ui/util/lbrytv');
const { LBRY_TV_API } = require('../../config');
const Router = require('@koa/router');

const router = new Router();

router.get(`/$/download/:claimName/:claimId`, async ctx => {
  const { claimName, claimId } = ctx.params;
  const downloadUrl = generateDownloadUrl(claimName, claimId);
  ctx.redirect(downloadUrl);
});

router.get('*', async ctx => {
  const html = await getHtml(ctx);
  ctx.body = html;
});

module.exports = router;
