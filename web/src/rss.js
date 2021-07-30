const { generateDownloadUrl } = require('../../ui/util/web');
const { URL, SITE_NAME, LBRY_WEB_API, FAVICON } = require('../../config.js');
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

async function getChannelClaim(name, claimId) {
  let claim;
  try {
    const url = `lbry://${name}#${claimId}`;
    const response = await Lbry.resolve({ urls: [url] });

    if (response && response[url] && !response[url].error) {
      claim = response && response[url];
    }
  } catch {}
  return claim || 'The RSS URL is invalid or is not associated with any channel.';
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

async function getFeed(channelClaim, feedLink) {
  const replaceLineFeeds = (str) => str.replace(/(?:\r\n|\r|\n)/g, '<br />');

  const fmtDescription = (description) => replaceLineFeeds(description);

  const sanitizeThumbsUrl = (url) => {
    if (typeof url === 'string' && url.startsWith('https://')) {
      return encodeURI(url).replace(/&/g, '%26');
    }
    return '';
  };

  const getEnclosure = (claim) => {
    const value = claim.value;
    if (!value || !value.stream_type || !value.source || !value.source.media_type) {
      return undefined;
    }

    switch (value.stream_type) {
      case 'video':
      case 'audio':
      case 'image':
      case 'document':
      case 'software':
        return {
          url: encodeURI(generateDownloadUrl(claim.name, claim.claim_id)),
          type: value.source.media_type,
          length: value.source.size || 0, // Per spec, 0 is a valid fallback.
        };

      default:
        return undefined;
    }
  };

  const value = channelClaim.value;
  const title = value ? value.title : channelClaim.name;

  const options = {
    favicon: FAVICON || URL + '/public/favicon.png',
    generator: SITE_NAME + ' RSS Feed',
    title: title + ' on ' + SITE_NAME,
    description: fmtDescription(value && value.description ? value.description : ''),
    link: encodeURI(`${URL}/${channelClaim.name}:${channelClaim.claim_id}`),
    image: sanitizeThumbsUrl(value && value.thumbnail ? value.thumbnail.url : ''),
    feedLinks: {
      rss: encodeURI(feedLink),
    },
    author: {
      name: encodeURI(channelClaim.name),
      link: encodeURI(URL + '/' + channelClaim.name + ':' + channelClaim.claim_id),
    },
  };

  const feed = new Feed(options);
  const latestClaims = await getClaimsFromChannel(channelClaim.claim_id, NUM_ENTRIES);

  latestClaims.forEach((c) => {
    const meta = c.meta;
    const value = c.value;

    const title = value && value.title ? value.title : c.name;
    const thumbnailUrl = value && value.thumbnail ? value.thumbnail.url : '';
    const thumbnailHtml = thumbnailUrl ? `<p><img src="${thumbnailUrl}" alt="thumbnail" title="${title}" /></p>` : '';

    feed.addItem({
      id: c.claim_id,
      guid: encodeURI(URL + '/' + c.name + ':' + c.claim_id),
      title: value && value.title ? value.title : c.name,
      description: thumbnailHtml + fmtDescription(value && value.description ? value.description : ''),
      link: encodeURI(URL + '/' + c.name + ':' + c.claim_id),
      date: new Date(meta ? meta.creation_timestamp * 1000 : null),
      enclosure: getEnclosure(c),
    });
  });

  return feed;
}

function postProcess(feed) {
  // Handle 'Feed' creating an invalid MIME type when trying to guess
  // from 'https://thumbnails.lbry.com/UCgQ8eREJzR1dO' style of URLs.
  return feed.replace(/type="image\/\/.*"\/>/g, 'type="image/*"/>');
}

async function getRss(ctx) {
  if (!ctx.params.claimName || !ctx.params.claimId) {
    return 'Invalid URL';
  }

  const channelClaim = await getChannelClaim(ctx.params.claimName, ctx.params.claimId);
  if (typeof channelClaim === 'string' || !channelClaim) {
    return channelClaim;
  }

  const feed = await getFeed(channelClaim, `${URL}${ctx.request.url}`);
  return postProcess(feed.rss2());
}

module.exports = { getRss };
