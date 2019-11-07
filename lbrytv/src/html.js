const { DOMAIN } = require('../../config.js');
const { generateStreamUrl } = require('../../ui/util/lbrytv');
const { getClaim } = require('./chainquery');
const { parseURI } = require('lbry-redux');
const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname, '/../dist/index.html'), 'utf8');

const defaultHead =
  '<title>lbry.tv</title>\n' +
  `<meta property="og:url" content="${DOMAIN}" />\n` +
  '<meta property="og:title" content="lbry.tv" />\n' +
  '<meta property="og:site_name" content="lbry.tv | Content Freedom"/>\n' +
  '<meta property="og:description" content="Meet LBRY, an open, free, and community-controlled content wonderland." />\n' +
  `<meta property="og:image" content="${DOMAIN}/og.png" />\n` +
  '<meta name="twitter:card" content="summary_large_image"/>\n' +
  `<meta name="twitter:image" content="${DOMAIN}/og.png"/>\n` +
  '<meta property="fb:app_id" content="1673146449633983" />';

function insertToHead(fullHtml, htmlToInsert = defaultHead) {
  return fullHtml.replace(/<!-- VARIABLE_HEAD_BEGIN -->.*<!-- VARIABLE_HEAD_END -->/s, htmlToInsert);
}

function truncateDescription(description) {
  return description.length > 200 ? description.substr(0, 200) + '...' : description;
}

function escapeHtmlProperty(property) {
  return property
    ? String(property)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    : '';
}

function buildOgMetadata(uri, claim) {
  const { isChannel } = parseURI(uri);
  const title = escapeHtmlProperty(claim.title ? claim.title : claimName);
  const claimDescription =
    claim.description && claim.description.length > 0
      ? escapeHtmlProperty(truncateDescription(claim.description))
      : `Watch ${title} on LBRY.tv`;
  const claimLanguage = escapeHtmlProperty(claim.language) || 'en_US';
  const claimThumbnail = escapeHtmlProperty(claim.thumbnail_url) || `${DOMAIN}/og.png`;
  const claimTitle = claim.channel && !isChannel ? `${title} from ${claim.channel} on LBRY.tv` : `${title} on LBRY.tv`;

  let head = '';

  head += '<meta charset="utf8"/>';
  head += `<title>${claimTitle}</title>`;
  head += `<meta name="description" content="${claimDescription}"/>`;
  if (claim.tags) {
    head += `<meta name="keywords" content="${claim.tags.toString()}"/>`;
  }
  head += `<meta name="twitter:card" content="summary_large_image"/>`;
  head += `<meta name="twitter:image" content="${claimThumbnail}"/>`;
  head += `<meta property="og:description" content="${claimDescription}"/>`;
  head += `<meta property="og:image" content="${claimThumbnail}"/>`;
  head += `<meta property="og:locale" content="${claimLanguage}"/>`;
  head += `<meta property="og:site_name" content="LBRY.tv"/>`;
  head += `<meta property="og:type" content="website"/>`;
  head += `<meta property="og:title" content="${claimTitle}"/>`;
  // below should be canonical_url, but not provided by chainquery yet
  head += `<meta property="og:url" content="${DOMAIN}/${claim.name}:${claim.claim_id}"/>`;

  if (claim.source_media_type && claim.source_media_type.startsWith('video/')) {
    const videoUrl = generateStreamUrl(claim.name, claim.claim_id);
    head += `<meta property="og:video" content="${videoUrl}" />`;
    head += `<meta property="og:video:secure_url" content="${videoUrl}" />`;
    head += `<meta property="og:video:type" content="${claim.source_media_type}" />`;
    if (claim.frame_width && claim.frame_height) {
      head += `<meta property="og:video:width" content="${claim.frame_width}"/>`;
      head += `<meta property="og:video:height" content="${claim.frame_height}"/>`;
    }
  }

  return head;
}

module.exports.getHtml = async function getHtml(ctx) {
  const path = ctx.path;

  if (path.length === 0 || path[1] === '$') {
    return insertToHead(html);
  }

  const claimUri = path.slice(1).replace(/:/g, '#');
  const { isChannel, streamName, channelName, channelClaimId, streamClaimId } = parseURI(claimUri);
  const claimName = isChannel ? '@' + channelName : streamName;
  const claimId = isChannel ? channelClaimId : streamClaimId;

  const rows = await getClaim(claimName, claimId, channelName, channelClaimId);
  if (!rows || !rows.length) {
    return insertToHead(html);
  }

  const claim = rows[0];
  const ogMetadata = buildOgMetadata(claimUri, claim);
  return insertToHead(html, ogMetadata);
};
