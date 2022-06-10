const Mime = require('mime-types');
const moment = require('moment');
const removeMd = require('remove-markdown');

// TODO: fix relative path for server
const { fetchStreamUrl } = require('../fetchStreamUrl');
const { parseURI } = require('../lbryURI');
const { OG_IMAGE_URL, SITE_NAME, URL } = require('../../../config.js');
const { generateEmbedUrl, getThumbnailCdnUrl, escapeHtmlProperty } = require('../../../ui/util/web');

// ****************************************************************************
// Utils
// ****************************************************************************

function lbryToOdyseeUrl(claim) {
  if (claim.canonical_url) {
    return `${URL}/${claim.canonical_url.replace('lbry://', '').replace(/#/g, ':')}`;
  }
}

function truncateDescription(description, maxChars = 200) {
  // Get list of single-codepoint strings
  const chars = [...description];
  // Use slice array instead of substring to prevent breaking emojis
  let truncated = chars.slice(0, maxChars).join('');
  // Format truncated string
  return chars.length > maxChars ? truncated + '...' : truncated;
}

// ****************************************************************************
// ****************************************************************************

const Generate = {
  author: (claim) => {
    const channelName = claim?.signing_channel?.value?.title || claim?.signing_channel?.name;
    const channelUrl = lbryToOdyseeUrl(claim.signing_channel);
    if (channelName && channelUrl) {
      return { '@type': 'Person', name: channelName, url: channelUrl };
    }
  },

  height: (claim) => {
    return claim?.value?.video?.height;
  },

  keywords: (claim) => {
    const tags = claim?.value?.tags;
    if (tags) {
      // Some claims, probably created from cli, have a crazy amount of tags.
      // Limit that to 10.
      return tags.slice(0, 10).join(',');
    }
  },

  potentialAction: (claim) => {
    // https://developers.google.com/search/docs/advanced/structured-data/video?hl=en#seek
    if ((claim?.value?.video || claim?.value?.audio) && claim.canonical_url) {
      return {
        '@type': 'SeekToAction',
        target: `${lbryToOdyseeUrl(claim)}?t={seek_to_second_number}`,
        'startOffset-input': 'required name=seek_to_second_number',
      };
    }
  },

  thumbnail: (url) => {
    // We don't have 'width' and 'height' from the claim :(
    return { '@type': 'ImageObject', url };
  },

  width: (claim) => {
    return claim?.value?.video?.width;
  },
};

// ****************************************************************************
// buildGoogleVideoMetadata
// ****************************************************************************

async function buildGoogleVideoMetadata(uri, claim) {
  const { claimName } = parseURI(uri);
  const { meta, value } = claim;
  const media = value && value.video;
  const source = value && value.source;
  let thumbnail = value && value.thumbnail && value.thumbnail.url && getThumbnailCdnUrl(value.thumbnail.url);
  const mediaType = source && source.media_type;
  const mediaDuration = media && media.duration;
  const claimTitle = escapeHtmlProperty((value && value.title) || claimName);
  const releaseTime = (value && value.release_time) || (meta && meta.creation_timestamp) || 0;

  const claimDescription =
    value && value.description && value.description.length > 0
      ? escapeHtmlProperty(truncateDescription(value.description))
      : `View ${claimTitle} on ${SITE_NAME}`;

  if (!mediaType || !mediaType.startsWith('video/')) {
    return '';
  }

  const claimThumbnail = escapeHtmlProperty(thumbnail) || getThumbnailCdnUrl(OG_IMAGE_URL) || `${URL}/public/v2-og.png`;

  const fileExt = value.source && value.source.media_type && '.' + Mime.extension(value.source.media_type);
  const claimStreamUrl =
    (await fetchStreamUrl(claim.name, claim.claim_id)).replace('/v4/', '/v3/') + (fileExt || '.mp4'); // v3 = mp4 always, v4 may redirect to m3u8;

  // https://developers.google.com/search/docs/data-types/video
  const googleVideoMetadata = {
    // --- Must ---
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${claimTitle}`,
    description: `${removeMd(claimDescription)}`,
    thumbnailUrl: `${claimThumbnail}`,
    uploadDate: `${new Date(releaseTime * 1000).toISOString()}`,
    // --- Recommended ---
    duration: mediaDuration ? moment.duration(mediaDuration * 1000).toISOString() : undefined,
    url: lbryToOdyseeUrl(claim),
    contentUrl: claimStreamUrl,
    embedUrl: generateEmbedUrl(claim.name, claim.claim_id),
    // --- Misc ---
    author: Generate.author(claim),
    thumbnail: Generate.thumbnail(claimThumbnail),
    keywords: Generate.keywords(claim),
    width: Generate.width(claim),
    height: Generate.height(claim),
    potentialAction: Generate.potentialAction(claim),
  };

  if (
    !googleVideoMetadata.description.replace(/\s/g, '').length ||
    googleVideoMetadata.thumbnailUrl.startsWith('data:image') ||
    !googleVideoMetadata.thumbnailUrl.startsWith('http')
  ) {
    return '';
  }

  return (
    '<script type="application/ld+json">\n' + JSON.stringify(googleVideoMetadata, null, '  ') + '\n' + '</script>\n'
  );
}

module.exports = { buildGoogleVideoMetadata };
