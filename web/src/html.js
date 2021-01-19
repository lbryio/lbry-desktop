const {
  URL,
  SITE_TITLE,
  SITE_CANONICAL_URL,
  OG_HOMEPAGE_TITLE,
  OG_TITLE_SUFFIX,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
} = require('../../config.js');
const { generateEmbedUrl, generateStreamUrl } = require('../../ui/util/web');
const PAGES = require('../../ui/constants/pages');
const { getClaim } = require('./chainquery');
const { parseURI } = require('lbry-redux');
const fs = require('fs');
const path = require('path');
const { getJsBundleId } = require('../bundle-id.js');
const jsBundleId = getJsBundleId();

function insertToHead(fullHtml, htmlToInsert, includeAdwords) {
  return fullHtml.replace(
    /<!-- VARIABLE_HEAD_BEGIN -->.*<!-- VARIABLE_HEAD_END -->/s,
    `
      ${htmlToInsert || buildOgMetadata()}
      <script src="/public/ui-${jsBundleId}.js" async></script>
      ${
        includeAdwords
          ? `<script data-ad-client="ca-pub-7102138296475003" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>`
          : ''
      }
    `
  );
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

//
// Normal metadata with option to override certain values
//
function buildOgMetadata(overrideOptions = {}) {
  const { title, description } = overrideOptions;
  const head =
    `<title>${SITE_TITLE}</title>\n` +
    `<meta property="og:url" content="${URL}" />\n` +
    `<meta property="og:title" content="${title || OG_HOMEPAGE_TITLE || SITE_TITLE}" />\n` +
    `<meta property="og:site_name" content="${SITE_NAME || SITE_TITLE}"/>\n` +
    `<meta property="og:description" content="${description || SITE_DESCRIPTION}" />\n` +
    `<meta property="og:image" content="${OG_IMAGE_URL || `${URL}/public/v2-og.png`}" />\n` +
    '<meta name="twitter:card" content="summary_large_image"/>\n' +
    `<meta name="twitter:title" content="${(title && title + OG_TITLE_SUFFIX) ||
      OG_HOMEPAGE_TITLE ||
      SITE_TITLE}" />\n` +
    `<meta name="twitter:description" content="${description || SITE_DESCRIPTION}" />\n` +
    `<meta name="twitter:image" content="${OG_IMAGE_URL || `${URL}/public/v2-og.png`}"/>\n` +
    `<meta name="twitter:url" content="${URL}" />\n` +
    '<meta property="fb:app_id" content="1673146449633983" />\n' +
    `<link rel="canonical" content="${SITE_CANONICAL_URL || URL}"/>` +
    `<link rel="search" type="application/opensearchdescription+xml" title="${SITE_NAME ||
      SITE_TITLE}" href="${URL}/opensearch.xml">`;
  return head;
}

function buildBasicOgMetadata() {
  const head = '<!-- VARIABLE_HEAD_BEGIN -->' + buildOgMetadata() + '<!-- VARIABLE_HEAD_END -->';
  return head;
}

//
// Metadata used for urls that need claim information
// Also has option to override defaults
//
function buildClaimOgMetadata(uri, claim, overrideOptions = {}) {
  // Initial setup for claim based og metadata
  const { claimName } = parseURI(uri);
  const claimTitle = escapeHtmlProperty(claim.title ? claim.title : claimName);
  const claimDescription =
    claim.description && claim.description.length > 0
      ? escapeHtmlProperty(truncateDescription(claim.description))
      : `View ${claimTitle} on ${SITE_NAME}`;
  const claimLanguage = escapeHtmlProperty(claim.language) || 'en_US';

  let imageThumbnail;

  if (Number(claim.fee) <= 0 && claim.source_media_type && claim.source_media_type.startsWith('image/')) {
    imageThumbnail = generateStreamUrl(claim.name, claim.claim_id);
  }
  const claimThumbnail = escapeHtmlProperty(claim.thumbnail_url) || imageThumbnail || `${URL}/public/v2-og.png`;

  // Allow for ovverriding default claim based og metadata
  const title = overrideOptions.title || claimTitle;
  const description = overrideOptions.description || claimDescription;

  let head = '';

  head += '<meta charset="utf8"/>';
  head += `<title>${title}</title>`;
  head += `<meta name="description" content="${description}"/>`;
  if (claim.tags) {
    head += `<meta name="keywords" content="${claim.tags.toString()}"/>`;
  }

  head += `<meta name="twitter:image" content="${claimThumbnail}"/>`;
  head += `<meta property="og:description" content="${description}"/>`;
  head += `<meta property="og:image" content="${claimThumbnail}"/>`;
  head += `<meta property="og:locale" content="${claimLanguage}"/>`;
  head += `<meta property="og:site_name" content="${SITE_NAME}"/>`;
  head += `<meta property="og:type" content="website"/>`;
  head += `<meta property="og:title" content="${title}"/>`;
  head += `<meta name="twitter:title" content="${title}"/>`;
  // below should be canonical_url, but not provided by chainquery yet
  head += `<meta property="og:url" content="${URL}/${claim.name}:${claim.claim_id}"/>`;
  head += `<meta name="twitter:url" content="${URL}/${claim.name}:${claim.claim_id}"/>`;
  head += `<link rel="canonical" content="${SITE_CANONICAL_URL || URL}/${claim.name}:${claim.claim_id}"/>`;

  if (
    claim.source_media_type &&
    (claim.source_media_type.startsWith('video/') || claim.source_media_type.startsWith('audio/'))
  ) {
    const videoUrl = generateEmbedUrl(claim.name, claim.claim_id);
    head += `<meta property="og:video" content="${videoUrl}" />`;
    head += `<meta property="og:video:secure_url" content="${videoUrl}" />`;
    head += `<meta property="og:video:type" content="${claim.source_media_type}" />`;
    if (claim.channel) {
      head += `<meta name="og:video:series" content="${claim.channel}"/>`;
    }
    head += `<meta name="twitter:card" content="player"/>`;
    head += `<meta name="twitter:player" content="${videoUrl}" />`;
    if (claim.release_time) {
      var release = new Date(claim.release_time * 1000).toISOString();
      head += `<meta property="og:video:release_date" content="${release}"/>`;
    }
    if (claim.duration) {
      head += `<meta property="og:video:duration" content="${claim.duration}"/>`;
    } else if (claim.audio_duration) {
      head += `<meta property="og:video:duration" content="${claim.audio_duration}"/>`;
    }
    if (claim.frame_width && claim.frame_height) {
      head += `<meta property="og:video:width" content="${claim.frame_width}"/>`;
      head += `<meta property="og:video:height" content="${claim.frame_height}"/>`;
      head += `<meta name="twitter:player:width" content="${claim.frame_width}">`;
      head += `<meta name="twitter:player:height" content="${claim.frame_height}">`;
    }
  } else {
    head += `<meta name="twitter:card" content="summary_large_image"/>`;
  }

  return head;
}

async function getClaimFromChainqueryOrRedirect(ctx, url, ignoreRedirect = false) {
  const { isChannel, streamName, channelName, channelClaimId, streamClaimId } = parseURI(url);
  const claimName = isChannel ? '@' + channelName : streamName;
  const claimId = isChannel ? channelClaimId : streamClaimId;

  const rows = await getClaim(claimName, claimId, channelName, channelClaimId);
  if (rows && rows.length) {
    const claim = rows[0];

    if (claim.reposted_name && claim.reposted_claim_id && !ignoreRedirect) {
      ctx.redirect(`/${claim.reposted_name}:${claim.reposted_claim_id}`);
      return;
    }

    return claim;
  }

  return undefined;
}

let html;
async function getHtml(ctx) {
  if (!html) {
    html = fs.readFileSync(path.join(__dirname, '/../dist/index.html'), 'utf8');
  }

  const requestPath = decodeURIComponent(ctx.path);
  if (requestPath.length === 0) {
    const ogMetadata = buildBasicOgMetadata();
    return insertToHead(html, ogMetadata, true);
  }

  const invitePath = `/$/${PAGES.INVITE}/`;
  const embedPath = `/$/${PAGES.EMBED}/`;

  if (requestPath.includes(invitePath)) {
    const inviteChannel = requestPath.slice(invitePath.length).replace(/:/g, '#');
    const inviteChannelUrl = `lbry://${inviteChannel}`;

    try {
      parseURI(inviteChannelUrl);
      const claim = await getClaimFromChainqueryOrRedirect(ctx, inviteChannelUrl);
      const invitePageMetadata = buildClaimOgMetadata(inviteChannelUrl, claim, {
        title: `Join ${claim.name} on ${SITE_NAME}`,
        description: `Join ${claim.name} on ${SITE_NAME}, a content wonderland owned by everyone (and no one).`,
      });

      return insertToHead(html, invitePageMetadata);
    } catch (e) {
      // Something about the invite channel is messed up
      // Enter generic invite metadata
      const invitePageMetadata = buildOgMetadata({
        title: `Join a friend on ${SITE_NAME}`,
        description: `Join a friend on ${SITE_NAME}, a content wonderland owned by everyone (and no one).`,
      });
      return insertToHead(html, invitePageMetadata);
    }
  }

  if (requestPath.includes(embedPath)) {
    const claimUri = requestPath.replace(embedPath, '').replace(/:/g, '#');
    const claim = await getClaimFromChainqueryOrRedirect(ctx, claimUri, true);

    if (claim) {
      const ogMetadata = buildClaimOgMetadata(claimUri, claim);
      return insertToHead(html, ogMetadata);
    }

    return insertToHead(html);
  }

  if (!requestPath.includes('$')) {
    const claimUri = requestPath.slice(1).replace(/:/g, '#');
    const claim = await getClaimFromChainqueryOrRedirect(ctx, claimUri);

    if (claim) {
      const ogMetadata = buildClaimOgMetadata(claimUri, claim);
      return insertToHead(html, ogMetadata, true);
    }
  }

  const ogMetadata = buildBasicOgMetadata();
  return insertToHead(html, ogMetadata, true);
}

module.exports = { insertToHead, buildBasicOgMetadata, getHtml };
