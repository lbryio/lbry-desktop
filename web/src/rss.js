const { URL, SITE_NAME, LBRY_WEB_API } = require('../../config.js');
const { Lbry } = require('lbry-redux');
const Feed = require('feed').Feed;

const SDK_API_PATH = `${LBRY_WEB_API}/api/v1`;
const proxyURL = `${SDK_API_PATH}/proxy`;
Lbry.setDaemonConnectionString(proxyURL);

const NUM_ENTRIES = 500;

async function doClaimSearch(options) {
  let results;
  try {
    results = await Lbry.claim_search(options);
  } catch {}
  return results ? results.items : undefined;
}

async function getChannelClaim(claimId) {
  const options = {
    claim_ids: [claimId],
    page_size: 1,
    no_totals: true,
  };

  const claims = await doClaimSearch(options);
  return claims ? claims[0] : undefined;
}

async function getClaimsFromChannel(claimId, count) {
  const options = {
    channel_ids: [claimId],
    page_size: count,
    has_source: true,
    claim_type: 'stream',
    order_by: ['creation_timestamp'],
    no_totals: true,
  };

  return await doClaimSearch(options);
}

async function getFeed(channelClaim) {
  const replaceLineFeeds = (str) => str.replace(/(?:\r\n|\r|\n)/g, '<br>');

  const value = channelClaim.value;
  const title = value ? value.title : channelClaim.name;

  const options = {
    title: title + ' on ' + SITE_NAME,
    description: value && value.description ? replaceLineFeeds(value.description) : '',
    link: `${URL}/${channelClaim.name}:${channelClaim.claim_id}`,
    favicon: URL + '/public/favicon.png',
    generator: SITE_NAME + ' RSS Feed',
    image: value && value.thumbnail ? value.thumbnail.url : '',
    author: {
      name: channelClaim.name,
      link: URL + '/' + channelClaim.name + ':' + channelClaim.claim_id,
    },
  };

  const feed = new Feed(options);

  const latestClaims = await getClaimsFromChannel(channelClaim.claim_id, NUM_ENTRIES);

  latestClaims.forEach((c) => {
    const meta = c.meta;
    const value = c.value;

    feed.addItem({
      guid: c.claim_id,
      id: c.claim_id,
      title: value ? value.title : c.name,
      description: value && value.description ? replaceLineFeeds(value.description) : '',
      image: value && value.thumbnail ? value.thumbnail.url : '',
      link: URL + '/' + c.name + ':' + c.claim_id,
      date: new Date(meta ? meta.creation_timestamp * 1000 : null),
    });
  });

  return feed;
}

async function getRss(ctx) {
  if (!ctx.params.claimName || !ctx.params.claimId) {
    return 'Invalid URL';
  }

  const channelClaim = await getChannelClaim(ctx.params.claimId);
  if (typeof channelClaim === 'string' || !channelClaim) {
    return channelClaim;
  }

  const feed = await getFeed(channelClaim);
  return feed.rss2();
}

module.exports = { getRss };
