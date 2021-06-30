const { URL, SITE_NAME } = require('../../config.js');
const { getChannelClaim, getClaimsFromChannel } = require('./chainquery');
const Feed = require('feed').Feed;

async function getChannelClaimFromChainquery(claimId) {
  const rows = await getChannelClaim(claimId);
  if (rows && rows.length) {
    const claim = rows[0];
    return claim;
  }

  return undefined;
}

async function getFeed(channelClaim) {
  const replaceLineFeeds = (str) => str.replace(/(?:\r\n|\r|\n)/g, '<br>');

  const options = {
    title: channelClaim.title + ' on ' + SITE_NAME,
    description: channelClaim.description ? replaceLineFeeds(channelClaim.description) : '',
    link: `${URL}/${channelClaim.name}:${channelClaim.claim_id}`,
    favicon: URL + '/public/favicon.png',
    generator: SITE_NAME + ' RSS Feed',
    image: channelClaim.thumbnail_url,
    author: {
      name: channelClaim.name,
      link: URL + '/' + channelClaim.name + ':' + channelClaim.claim_id,
    },
  };

  const feed = new Feed(options);

  const latestClaims = await getClaimsFromChannel(channelClaim.claim_id, 10);

  latestClaims.forEach((c) => {
    feed.addItem({
      guid: c.claim_id,
      id: c.claim_id,
      title: c.title,
      description: c.description ? replaceLineFeeds(c.description) : '',
      image: c.thumbnail_url,
      link: URL + '/' + c.name + ':' + c.claim_id,
      date: new Date(c.created_at),
    });
  });

  return feed;
}

async function getRss(ctx) {
  if (!ctx.params.claimName || !ctx.params.claimId) {
    return 'Invalid URL';
  }

  const channelClaim = await getChannelClaimFromChainquery(ctx.params.claimId);
  if (channelClaim) {
    const feed = await getFeed(channelClaim);
    return feed.rss2();
  }

  return 'Invalid channel';
}

module.exports = { getRss };
