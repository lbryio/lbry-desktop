const { getHtml } = require('./html');
const { generateStreamUrl } = require('../../ui/util/lbrytv');
const { LBRY_TV_API } = require('../../config');
const Router = require('@koa/router');
const send = require('koa-send');

const router = new Router();

// TODO
// router.get(`/embed/:claimName/:claimId`, async ctx => {
// Proxy request through lbrytv
// });

router.get('*', async ctx => {
  const html = await getHtml(ctx);
  ctx.body = html;
});

module.exports = router;
