const moment = require('moment');
const removeMd = require('remove-markdown');

// TODO: fix relative path for server
const { parseURI } = require('../lbryURI');
const { OG_IMAGE_URL, SITE_NAME, URL } = require('../../../config.js');
const { generateDirectUrl, generateEmbedUrl, getThumbnailCdnUrl, escapeHtmlProperty } = require('../../../ui/util/web');

function truncateDescription(description, maxChars = 200) {
  // Get list of single-codepoint strings
  const chars = [...description];
  // Use slice array instead of substring to prevent breaking emojis
  let truncated = chars.slice(0, maxChars).join('');
  // Format truncated string
  return chars.length > maxChars ? truncated + '...' : truncated;
}

// ****************************************************************************
// buildGoogleVideoMetadata
// ****************************************************************************

function buildGoogleVideoMetadata(uri, claim) {
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
    contentUrl: generateDirectUrl(claim.name, claim.claim_id),
    embedUrl: generateEmbedUrl(claim.name, claim.claim_id),
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
