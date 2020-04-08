const { getHtml } = require('./html');
const { Lbryio } = require('lbryinc/dist/bundle.es.js');
const { generateStreamUrl, CONTINENT_COOKIE } = require('../../ui/util/lbrytv');
const fetch = require('node-fetch');
const Router = require('@koa/router');

// So any code from 'lbry-redux'/'lbryinc' that uses `fetch` can be run on the server
global.fetch = fetch;

const router = new Router();

function getStreamUrl(ctx) {
  const { claimName, claimId } = ctx.params;

  // hack to get around how we managing the continent cookie
  // defaulting to "NA" becasue saved-passwords.js assumes it's in the browser and won't work properly
  // changes need to be made to that to better work with the server
  const streamingContinentCookie = ctx.cookies.get(CONTINENT_COOKIE) || 'NA';
  const streamUrl = generateStreamUrl(claimName, claimId, undefined, streamingContinentCookie);
  return streamUrl;
}

function getSupportedCDN(continent) {
  switch (continent) {
    case 'NA':
    case 'EU':
      return continent;
    default:
      return 'NA';
  }
}

async function fetchContinentCookie() {
  return Lbryio.call('locale', 'get', {}, 'post').then(result => {
    const userContinent = getSupportedCDN(result.continent);
    return userContinent;
  });
}

router.get(`/$/download/:claimName/:claimId`, async ctx => {
  const streamUrl = getStreamUrl(ctx);
  const downloadUrl = `${streamUrl}?download=1`;
  ctx.redirect(downloadUrl);
});

router.get(`/$/stream/:claimName/:claimId`, async ctx => {
  const streamUrl = getStreamUrl(ctx);
  ctx.redirect(streamUrl);
});

router.get('*', async ctx => {
  const hasContinentCookie = ctx.cookies.get(CONTINENT_COOKIE);
  if (!hasContinentCookie) {
    const continentValue = await fetchContinentCookie();
    ctx.cookies.set(CONTINENT_COOKIE, continentValue, { httpOnly: false });
  }
  const html = await getHtml(ctx);
  ctx.body = html;
});

module.exports = router;
