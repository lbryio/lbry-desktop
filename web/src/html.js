const {
  FAVICON,
  OG_HOMEPAGE_TITLE,
  OG_IMAGE_URL,
  OG_TITLE_SUFFIX,
  PROXY_URL,
  SITE_CANONICAL_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  URL,
} = require('../../config.js');

const { CATEGORY_METADATA } = require('./category-metadata');
const {
  generateDirectUrl,
  generateEmbedUrl,
  generateStreamUrl,
  getParameterByName,
  getThumbnailCdnUrl,
  escapeHtmlProperty,
  unscapeHtmlProperty,
} = require('../../ui/util/web');
const { getJsBundleId } = require('../bundle-id.js');
const { lbryProxy: Lbry } = require('../lbry');
const { buildURI, parseURI, normalizeClaimUrl } = require('./lbryURI');
const fs = require('fs');
const moment = require('moment');
const PAGES = require('../../ui/constants/pages');
const path = require('path');
const removeMd = require('remove-markdown');

const jsBundleId = getJsBundleId();
Lbry.setDaemonConnectionString(PROXY_URL);

const BEGIN_STR = '<!-- VARIABLE_HEAD_BEGIN -->';
const FINAL_STR = '<!-- VARIABLE_HEAD_END -->';

function insertToHead(fullHtml, htmlToInsert) {
  const beginIndex = fullHtml.indexOf(BEGIN_STR);
  const finalIndex = fullHtml.indexOf(FINAL_STR);

  if (beginIndex > -1 && finalIndex > -1 && finalIndex > beginIndex) {
    return `${fullHtml.slice(0, beginIndex)}${
      htmlToInsert || buildOgMetadata()
    }<script src="/public/ui-${jsBundleId}.js" async></script>${fullHtml.slice(finalIndex + FINAL_STR.length)}`;
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

function getCategoryMetaRenderFn(path) {
  const page = Object.keys(CATEGORY_METADATA).find((x) => path === `/$/${x}` || path === `/$/${x}/`);
  return CATEGORY_METADATA[page];
}

//
// Normal metadata with option to override certain values
//
function buildOgMetadata(overrideOptions = {}) {
  const { title, description, image, path, urlQueryString } = overrideOptions;
  const cleanDescription = escapeHtmlProperty(removeMd(description || SITE_DESCRIPTION));
  const cleanTitle = escapeHtmlProperty(title);
  const url = (path ? `${URL}${path}` : URL) + (urlQueryString ? `?${urlQueryString}` : '');

  const head =
    `<title>${SITE_TITLE}</title>\n` +
    `<meta name="description" content="${cleanDescription}" />\n` +
    `<meta property="og:url" content="${url}" />\n` +
    `<meta property="og:title" content="${cleanTitle || OG_HOMEPAGE_TITLE || SITE_TITLE}" />\n` +
    `<meta property="og:site_name" content="${SITE_NAME || SITE_TITLE}"/>\n` +
    `<meta property="og:description" content="${cleanDescription}" />\n` +
    `<meta property="og:image" content="${
      getThumbnailCdnUrl(image) || getThumbnailCdnUrl(OG_IMAGE_URL) || `${URL}/public/v2-og.png`
    }" />\n` +
    `<meta property="og:type" content="website"/>\n` +
    '<meta name="twitter:card" content="summary_large_image"/>\n' +
    `<meta name="twitter:title" content="${
      (cleanTitle && cleanTitle + ' ' + OG_TITLE_SUFFIX) || OG_HOMEPAGE_TITLE || SITE_TITLE
    }" />\n` +
    `<meta name="twitter:description" content="${cleanDescription}" />\n` +
    `<meta name="twitter:image" content="${
      getThumbnailCdnUrl(image) || getThumbnailCdnUrl(OG_IMAGE_URL) || `${URL}/public/v2-og.png`
    }"/>\n` +
    '<meta property="fb:app_id" content="1673146449633983" />\n' +
    `<link rel="canonical" content="${SITE_CANONICAL_URL || URL}"/>` +
    `<link rel="search" type="application/opensearchdescription+xml" title="${
      SITE_NAME || SITE_TITLE
    }" href="${URL}/opensearch.xml">`;
  return head;
}

function addPWA() {
  let head = '';
  head += '<link rel="manifest" href="/public/pwa/manifest.json"/>';
  head += '<link rel="apple-touch-icon" sizes="180x180" href="/public/pwa/icon-180.png">';
  head += `<script>
      window.addEventListener('load', function() {
        if("serviceWorker" in navigator){navigator.serviceWorker.register("/sw.js")}
      });
    </script>`;
  return head;
}

function addFavicon() {
  let head = '';
  head += `<link rel="icon" type="image/png" href="${FAVICON || './public/favicon.png'}" />`;
  return head;
}

function buildHead() {
  const head = BEGIN_STR + addFavicon() + addPWA() + buildOgMetadata() + FINAL_STR;
  return head;
}

function buildBasicOgMetadata() {
  const head = BEGIN_STR + addFavicon() + buildOgMetadata() + FINAL_STR;
  return head;
}

//
// Metadata used for urls that need claim information
// Also has option to override defaults
//
function buildClaimOgMetadata(uri, claim, overrideOptions = {}, referrerQuery) {
  // Initial setup for claim based og metadata
  const { claimName } = parseURI(uri);
  const { meta, value, signing_channel } = claim;
  const fee = value && value.fee && (Number(value.fee.amount) || 0);
  const tags = value && value.tags;
  const media = value && (value.video || value.audio || value.image);
  const source = value && value.source;
  const channel = signing_channel && signing_channel.name;
  let thumbnail = value && value.thumbnail && value.thumbnail.url && getThumbnailCdnUrl(value.thumbnail.url);
  const mediaType = source && source.media_type;
  const mediaDuration = media && media.duration;
  const claimTitle = escapeHtmlProperty((value && value.title) || claimName);
  const releaseTime = (value && value.release_time) || (meta && meta.creation_timestamp) || 0;

  const claimDescription =
    value && value.description && value.description.length > 0
      ? escapeHtmlProperty(truncateDescription(value.description))
      : `View ${claimTitle} on ${SITE_NAME}`;

  const claimLanguage =
    value && value.languages && value.languages.length > 0 ? escapeHtmlProperty(value.languages[0]) : 'en_US';

  let imageThumbnail;

  if (fee <= 0 && mediaType && mediaType.startsWith('image/')) {
    imageThumbnail = generateStreamUrl(claim.name, claim.claim_id);
  }

  const claimThumbnail =
    escapeHtmlProperty(thumbnail) ||
    getThumbnailCdnUrl(imageThumbnail) ||
    getThumbnailCdnUrl(OG_IMAGE_URL) ||
    `${URL}/public/v2-og.png`;

  // Allow for overriding default claim based og metadata
  const title = overrideOptions.title || claimTitle;
  const description = overrideOptions.description || claimDescription;
  const cleanDescription = removeMd(description);
  const claimPath = `${URL}/${claim.canonical_url.replace('lbry://', '').replace('#', ':')}`;

  let head = '';

  head += `${addFavicon()}`;
  head += '<meta charset="utf8"/>';
  head += `<title>${title}</title>`;
  head += `<meta name="description" content="${cleanDescription}"/>`;

  if (tags && tags.length > 0) {
    head += `<meta name="keywords" content="${tags.toString()}"/>`;
  }

  head += `<meta name="twitter:image" content="${claimThumbnail}"/>`;
  head += `<meta name="twitter:player:image" content="${claimThumbnail}"/>`;
  head += `<meta name="twitter:site" content="@OdyseeTeam"/>`;
  head += `<meta property="og:description" content="${cleanDescription}"/>`;
  head += `<meta property="og:image" content="${claimThumbnail}"/>`;
  head += `<meta property="og:locale" content="${claimLanguage}"/>`;
  head += `<meta property="og:site_name" content="${SITE_NAME}"/>`;
  head += `<meta property="og:type" content="website"/>`;
  head += `<meta property="og:title" content="${title}"/>`;
  head += `<meta name="twitter:title" content="${title}"/>`;
  head += `<meta property="og:url" content="${claimPath}"/>`;
  head += `<meta name="twitter:url" content="${claimPath}"/>`;
  head += `<meta property="fb:app_id" content="1673146449633983" />`;
  head += `<link rel="canonical" content="${claimPath}"/>`;
  head += `<link rel="alternate" type="application/json+oembed" href="${URL}/$/oembed?url=${encodeURIComponent(
    claimPath
  )}&format=json${referrerQuery ? `&r=${encodeURIComponent(referrerQuery)}` : ''}" title="${title}" />`;
  head += `<link rel="alternate" type="text/xml+oembed" href="${URL}/$/oembed?url=${encodeURIComponent(
    claimPath
  )}&format=xml${referrerQuery ? `&r=${encodeURIComponent(referrerQuery)}` : ''}" title="${title}" />`;

  if (mediaType && (mediaType.startsWith('video/') || mediaType.startsWith('audio/'))) {
    const videoUrl = generateEmbedUrl(claim.name, claim.claim_id);
    head += `<meta property="og:video" content="${videoUrl}" />`;
    head += `<meta property="og:video:secure_url" content="${videoUrl}" />`;
    head += `<meta property="og:video:type" content="${mediaType}" />`;
    if (channel) {
      head += `<meta name="og:video:series" content="${channel}"/>`;
    }
    head += `<meta name="twitter:card" content="player"/>`;
    head += `<meta name="twitter:player" content="${videoUrl}" />`;
    if (releaseTime) {
      var release = new Date(releaseTime * 1000).toISOString();
      head += `<meta property="og:video:release_date" content="${release}"/>`;
    }
    if (mediaDuration) {
      head += `<meta property="og:video:duration" content="${mediaDuration}"/>`;
    }
    if (media && media.width && media.height) {
      head += `<meta property="og:video:width" content="${media.width}"/>`;
      head += `<meta property="og:video:height" content="${media.height}"/>`;
      head += `<meta name="twitter:player:width" content="${media.width}">`;
      head += `<meta name="twitter:player:height" content="${media.height}">`;
    }
  } else {
    head += `<meta name="twitter:card" content="summary_large_image"/>`;
  }

  return head;
}

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

async function resolveClaimOrRedirect(ctx, url, ignoreRedirect = false) {
  let claim;
  try {
    const response = await Lbry.resolve({ urls: [url] });
    if (response && response[url] && !response[url].error) {
      claim = response && response[url];
      const isRepost = claim.reposted_claim && claim.reposted_claim.name && claim.reposted_claim.claim_id;
      if (isRepost && !ignoreRedirect) {
        ctx.redirect(`/${claim.reposted_claim.name}:${claim.reposted_claim.claim_id}`);
        return;
      }
    }
  } catch {}
  return claim;
}

let html;
async function getHtml(ctx) {
  if (!html) {
    html = fs.readFileSync(path.join(__dirname, '/../dist/index.html'), 'utf8');
  }

  const requestPath = unscapeHtmlProperty(decodeURIComponent(ctx.path));
  if (requestPath.length === 0) {
    const ogMetadata = buildBasicOgMetadata();
    return insertToHead(html, ogMetadata);
  }

  if (ctx?.request?.url) {
    ctx.request.url = encodeURIComponent(escapeHtmlProperty(decodeURIComponent(ctx.request.url)));
  }

  const invitePath = `/$/${PAGES.INVITE}/`;
  const embedPath = `/$/${PAGES.EMBED}/`;

  if (requestPath.includes(invitePath)) {
    try {
      const inviteChannel = requestPath.slice(invitePath.length);
      const inviteChannelUrl = normalizeClaimUrl(inviteChannel);
      const claim = await resolveClaimOrRedirect(ctx, inviteChannelUrl);
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
    const claimUri = normalizeClaimUrl(requestPath.replace(embedPath, '').replace('/', '#'));
    const claim = await resolveClaimOrRedirect(ctx, claimUri, true);

    if (claim) {
      const ogMetadata = buildClaimOgMetadata(claimUri, claim);
      const googleVideoMetadata = buildGoogleVideoMetadata(claimUri, claim);
      return insertToHead(html, ogMetadata.concat('\n', googleVideoMetadata));
    }

    return insertToHead(html);
  }

  const categoryMetaFn = getCategoryMetaRenderFn(requestPath);
  if (categoryMetaFn) {
    const categoryMeta = categoryMetaFn(ctx.request.query);
    const categoryPageMetadata = buildOgMetadata({
      ...categoryMeta,
      path: requestPath,
    });
    return insertToHead(html, categoryPageMetadata);
  }

  if (!requestPath.includes('$')) {
    const parsedUri = parseURI(normalizeClaimUrl(requestPath.slice(1)));
    const claimUri = buildURI({ ...parsedUri, startTime: undefined });
    const claim = await resolveClaimOrRedirect(ctx, claimUri);
    const referrerQuery = escapeHtmlProperty(getParameterByName('r', ctx.request.url));

    if (claim) {
      const ogMetadata = buildClaimOgMetadata(claimUri, claim, {}, referrerQuery);
      const googleVideoMetadata = buildGoogleVideoMetadata(claimUri, claim);
      return insertToHead(html, ogMetadata.concat('\n', googleVideoMetadata));
    }
  }

  const ogMetadataAndPWA = buildHead();
  return insertToHead(html, ogMetadataAndPWA);
}

module.exports = { insertToHead, buildHead, getHtml };
