const { generateStreamUrl } = require('../../ui/util/web');
const { lbryProxy: Lbry } = require('../lbry');
const { URL, SITE_NAME, PROXY_URL } = require('../../config.js');
const Mime = require('mime-types');
const Rss = require('rss');

Lbry.setDaemonConnectionString(PROXY_URL);

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
    order_by: ['release_time'],
    no_totals: true,
  };

  return await doClaimSearch(options);
}

// ****************************************************************************
// Helpers
// ****************************************************************************

function encodeWithSpecialCharEncode(string) {
  // encodeURIComponent doesn't encode `'` and others
  // which other services may not like
  return encodeURIComponent(string).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

const generateEnclosureForClaimContent = (claim) => {
  const value = claim.value;
  if (!value || !value.stream_type) {
    return undefined;
  }
  const fileExt = value.source && value.source.media_type && '.' + Mime.extension(value.source.media_type);

  switch (value.stream_type) {
    case 'video':
      return {
        url: generateStreamUrl(claim.name, claim.claim_id) + (fileExt || '.mp4'),
        type: (value.source && value.source.media_type) || 'video/mp4',
        size: (value.source && value.source.size) || 0, // Per spec, 0 is a valid fallback.
      };

    case 'audio':
      return {
        url: generateStreamUrl(claim.name, claim.claim_id) + ((fileExt === '.mpga' ? '.mp3' : fileExt) || '.mp3'),
        type: (value.source && value.source.media_type) || 'audio/mpeg',
        size: (value.source && value.source.size) || 0, // Per spec, 0 is a valid fallback.
      };
    case 'image':
      return {
        url: generateStreamUrl(claim.name, claim.claim_id) + (fileExt || '.jpeg'),
        type: (value.source && value.source.media_type) || 'image/jpeg',
        size: (value.source && value.source.size) || 0, // Per spec, 0 is a valid fallback.
      };
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
  const {
    value: { languages },
  } = claim;

  return languages && languages.length > 0 ? languages[0] : 'en';
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
  let email = 'no-reply@odysee.com';
  const { value } = claim;
  const name = (value && value.title) || claim.name;

  if (isEmailRoughlyValid(value.email)) {
    email = value.email;
  }

  return {
    'itunes:owner': [{ 'itunes:name': name }, { 'itunes:email': email }],
  };
};

const generateItunesExplicitElement = (claim) => {
  const tags = (claim && claim.value && claim.value.tags) || [];
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

  const tags = (claim && claim.value && claim.value.tags) || [];

  for (let i = 0; i < itunesCategories.length; ++i) {
    const itunesCategory = itunesCategories[i];
    if (tags.includes(itunesCategory.toLowerCase())) {
      // "Note: Although you can specify more than one category and subcategory
      // in your RSS feed, Apple Podcasts only recognizes the first category and
      // subcategory."
      // --> The only parse the first found tag.
      return itunesCategory.replace('&', '&amp;');
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

const getFormattedDescription = (claim) => replaceLineFeeds(claim.value.description || '');

// ****************************************************************************
// Generate
// ****************************************************************************

function generateFeed(feedLink, channelClaim, claimsInChannel) {
  // --- Channel ---
  let channelTitle = (channelClaim.value && channelClaim.value.title) || channelClaim.name;
  let channelURL = URL + '/' + channelClaim.canonical_url.replace('lbry://', '').replace(/#/g, ':');
  const feed = new Rss({
    title: channelTitle + ' on ' + SITE_NAME,
    description: getFormattedDescription(channelClaim),
    feed_url: feedLink,
    site_url: (channelClaim.value && channelClaim.value.website_url) || channelURL,
    image_url: (channelClaim.value && channelClaim.value.thumbnail && channelClaim.value.thumbnail.url) || undefined,
    language: getLanguageValue(channelClaim),
    custom_namespaces: { itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd' },
    custom_elements: [
      { 'itunes:author': channelTitle },
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

    const url = `${URL}/${encodeWithSpecialCharEncode(c.name)}:${c.claim_id}`;
    const date =
      c.value && c.value.release_time ? c.value.release_time * 1000 : c.meta && c.meta.creation_timestamp * 1000;

    feed.item({
      title: title,
      description: description,
      url: url,
      guid: undefined, // defaults to 'url'
      author: undefined, // defaults feed author property
      date: new Date(date),
      enclosure: generateEnclosureForClaimContent(c),
      custom_elements: [
        { 'itunes:title': title },
        { 'itunes:author': channelTitle },
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
