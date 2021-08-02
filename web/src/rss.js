const { generateStreamUrl } = require('../../ui/util/web');
const { URL, SITE_NAME, LBRY_WEB_API } = require('../../config.js');
const { Lbry } = require('lbry-redux');
const Rss = require('rss');

const SDK_API_PATH = `${LBRY_WEB_API}/api/v1`;
const proxyURL = `${SDK_API_PATH}/proxy`;
Lbry.setDaemonConnectionString(proxyURL);

const NUM_ENTRIES = 500;

// ****************************************************************************
// Fetch claim info
// ****************************************************************************

async function doClaimSearch(options) {
  let results;
  try {
    results = await Lbry.claim_search(options);
  } catch {}
  return results ? results.items : undefined;
}

async function getChannelClaim(name, claimId) {
  let claim;
  let error;

  try {
    const url = `lbry://${name}#${claimId}`;
    const response = await Lbry.resolve({ urls: [url] });
    if (response && response[url] && !response[url].error) {
      claim = response && response[url];
    }
  } catch {}

  if (!claim) {
    error = 'The RSS URL is invalid or is not associated with any channel.';
  }

  return { claim, error };
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

// ****************************************************************************
// Helpers
// ****************************************************************************

const generateEnclosureForClaimContent = (claim) => {
  const value = claim.value;
  if (!value || !value.stream_type) {
    return undefined;
  }

  switch (value.stream_type) {
    case 'video':
    case 'audio':
    case 'image':
    case 'document':
    case 'software':
      return {
        url: generateStreamUrl(claim.name, claim.claim_id),
        type: (value.source && value.source.media_type) || undefined,
        size: (value.source && value.source.size) || 0, // Per spec, 0 is a valid fallback.
      };

    default:
      return undefined;
  }
};

const getLanguageValue = (claim) => {
  if (claim && claim.value && claim.value.languages && claim.value.languages.length > 0) {
    return claim.value.languages[0];
  }
  return 'en';
};

const replaceLineFeeds = (str) => str.replace(/(?:\r\n|\r|\n)/g, '<br />');

const isEmailRoughlyValid = (email) => /^\S+@\S+$/.test(email);

/**
 * 'itunes:owner' is required by castfeedvalidator (w3c allows omission), and
 * both name and email must be defined. The email must also be a "valid" one.
 *
 * Use a fallback email when the creator did not specify one. The email will not
 * be shown to the user; it is just used for administrative purposes.
 *
 * @param claim
 * @returns any
 */
const generateItunesOwnerElement = (claim) => {
  let name = '---';
  let email = 'no-reply@odysee.com';

  if (claim && claim.value) {
    name = claim.name;
    if (isEmailRoughlyValid(claim.value.email)) {
      email = claim.value.email;
    }
  }

  return {
    'itunes:owner': [{ 'itunes:name': name }, { 'itunes:email': email }],
  };
};

const generateItunesExplicitElement = (claim) => {
  const tags = (claim && claim.value && claim.tags) || [];
  return { 'itunes:explicit': tags.includes('mature') ? 'yes' : 'no' };
};

const getItunesCategory = (claim) => {
  const itunesCategories = [
    'Arts',
    'Business',
    'Comedy',
    'Education',
    'Fiction',
    'Government',
    'History',
    'Health & Fitness',
    'Kids & Family',
    'Leisure',
    'Music',
    'News',
    'Religion & Spirituality',
    'Science',
    'Society & Culture',
    'Sports',
    'Technology',
    'True Crime',
    'TV & Film',
  ];

  const tags = (claim && claim.value && claim.tags) || [];
  for (let i = 0; i < tags.length; ++i) {
    const tag = tags[i];
    if (itunesCategories.includes(tag)) {
      // "Note: Although you can specify more than one category and subcategory
      // in your RSS feed, Apple Podcasts only recognizes the first category and
      // subcategory."
      // --> The only parse the first found tag.
      return tag.replace('&', '&amp;');
    }
  }

  // itunes will not accept any other categories, and the element is required
  // to pass castfeedvalidator. So, fallback to 'Leisure' (closes to "General")
  // if the creator did not specify a tag.
  return 'Leisure';
};

const generateItunesDurationElement = (claim) => {
  let duration;
  if (claim && claim.value) {
    if (claim.value.video) {
      duration = claim.value.video.duration;
    } else if (claim.value.audio) {
      duration = claim.value.audio.duration;
    }
  }

  if (duration) {
    return { 'itunes:duration': `${duration}` };
  }
};

const generateItunesImageElement = (claim) => {
  const thumbnailUrl = (claim && claim.value && claim.value.thumbnail && claim.value.thumbnail.url) || '';
  if (thumbnailUrl) {
    return {
      'itunes:image': { _attr: { href: thumbnailUrl } },
    };
  }
};

const getFormattedDescription = (claim) => {
  return replaceLineFeeds((claim && claim.value && claim.value.description) || '');
};

// ****************************************************************************
// Generate
// ****************************************************************************

function generateFeed(feedLink, channelClaim, claimsInChannel) {
  // --- Channel ---
  const feed = new Rss({
    title: ((channelClaim.value && channelClaim.value.title) || channelClaim.name) + ' on ' + SITE_NAME,
    description: getFormattedDescription(channelClaim),
    feed_url: feedLink,
    site_url: URL,
    image_url: (channelClaim.value && channelClaim.value.thumbnail && channelClaim.value.thumbnail.url) || undefined,
    language: getLanguageValue(channelClaim),
    custom_namespaces: { itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd' },
    custom_elements: [
      { 'itunes:author': channelClaim.name },
      {
        'itunes:category': [
          {
            _attr: {
              text: getItunesCategory(channelClaim),
            },
          },
        ],
      },
      generateItunesImageElement(channelClaim),
      generateItunesOwnerElement(channelClaim),
      generateItunesExplicitElement(channelClaim),
    ],
  });

  // --- Content ---
  claimsInChannel.forEach((c) => {
    const title = (c.value && c.value.title) || c.name;
    const thumbnailUrl = (c.value && c.value.thumbnail && c.value.thumbnail.url) || '';
    const thumbnailHtml = thumbnailUrl
      ? `<p><img src="${thumbnailUrl}" width="480" alt="thumbnail" title="${title}" /></p>`
      : '';
    const description = thumbnailHtml + getFormattedDescription(c);

    feed.item({
      title: title,
      description: description,
      url: `${URL}/${c.name}:${c.claim_id}`,
      guid: undefined, // defaults to 'url'
      author: undefined, // defaults feed author property
      date: new Date(c.meta ? c.meta.creation_timestamp * 1000 : null),
      enclosure: generateEnclosureForClaimContent(c),
      custom_elements: [
        { 'itunes:title': title },
        { 'itunes:author': channelClaim.name },
        generateItunesImageElement(c),
        generateItunesDurationElement(c),
        generateItunesExplicitElement(c),
      ],
    });
  });

  return feed;
}

async function getRss(ctx) {
  if (!ctx.params.claimName || !ctx.params.claimId) {
    return 'Invalid URL';
  }

  const { claim: channelClaim, error } = await getChannelClaim(ctx.params.claimName, ctx.params.claimId);
  if (error) {
    return error;
  }

  const latestClaimsInChannel = await getClaimsFromChannel(channelClaim.claim_id, NUM_ENTRIES);
  const feed = generateFeed(`${URL}${ctx.request.url}`, channelClaim, latestClaimsInChannel);
  return feed.xml();
}

module.exports = { getRss };
