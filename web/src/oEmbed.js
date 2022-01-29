const { URL, SITE_NAME, PROXY_URL, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH } = require('../../config.js');

const {
  generateEmbedIframeData,
  generateEmbedUrl,
  getParameterByName,
  getThumbnailCdnUrl,
  escapeHtmlProperty,
} = require('../../ui/util/web');
const { lbryProxy: Lbry } = require('../lbry');

Lbry.setDaemonConnectionString(PROXY_URL);

// ****************************************************************************
// Fetch claim info
// ****************************************************************************

async function getClaim(requestUrl) {
  const uri = requestUrl.replace(`${URL}/`, 'lbry://');

  let claim;
  let error;

  try {
    const response = await Lbry.resolve({ urls: [uri] });
    if (response && response[uri] && !response[uri].error) {
      claim = response[uri];
    }
  } catch {}

  if (!claim) {
    error = 'The URL is invalid or is not associated with any claim.';
  } else {
    const { value_type, value } = claim;

    if (value_type !== 'stream' || value.stream_type !== 'video') {
      error = 'The URL is not associated with a video claim.';
    }
  }

  return { claim, error };
}

// ****************************************************************************
// Generate
// ****************************************************************************

function generateOEmbedData(claim, referrerQuery) {
  const { value, signing_channel: authorClaim } = claim;

  const claimTitle = value.title;
  const authorName = authorClaim ? authorClaim.value.title || authorClaim.name : 'Anonymous';
  const authorUrlPath = authorClaim && authorClaim.canonical_url.replace('lbry://', '').replace('#', ':');
  const authorUrl = authorClaim ? `${URL}/${authorUrlPath}` : null;
  const thumbnailUrl = value && value.thumbnail && value.thumbnail.url && getThumbnailCdnUrl(value.thumbnail.url);
  const videoUrl =
    encodeURIComponent(generateEmbedUrl(claim.name, claim.claim_id)) +
    (referrerQuery ? `r=${encodeURIComponent(escapeHtmlProperty(referrerQuery))}` : '');

  const { html, width, height } = generateEmbedIframeData(videoUrl);

  return {
    type: 'video',
    version: '1.0',
    title: claimTitle,
    author_name: authorName,
    author_url: authorUrl,
    provider_name: SITE_NAME,
    provider_url: URL,
    thumbnail_url: thumbnailUrl,
    thumbnail_width: THUMBNAIL_WIDTH,
    thumbnail_height: THUMBNAIL_HEIGHT,
    html: html,
    width: width,
    height: height,
  };
}

function generateXmlData(oEmbedData) {
  const {
    type,
    version,
    title,
    author_name,
    author_url,
    provider_name,
    provider_url,
    thumbnail_url,
    thumbnail_width,
    thumbnail_height,
    html,
    width,
    height,
  } = oEmbedData;

  return (
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<oembed>' +
    `<type>${type}</type>` +
    `<version>${version}</version>` +
    `<title>${title}</title>` +
    `<author_name>${author_name}</author_name>` +
    `<author_url>${author_url}</author_url>` +
    `<provider_name>${provider_name}</provider_name>` +
    `<provider_url>${provider_url}</provider_url>` +
    `<thumbnail_url>${thumbnail_url}</thumbnail_url>` +
    `<thumbnail_width>${thumbnail_width}</thumbnail_width>` +
    `<thumbnail_height>${thumbnail_height}</thumbnail_height>` +
    `<html>${html}</html>` +
    `<width>${width}</width>` +
    `<height>${height}</height>` +
    '<oembed>'
  );
}

async function getOEmbed(ctx) {
  const requestUrl = ctx.request.url;
  const urlQuery = getParameterByName('url', requestUrl);

  const { claim, error } = await getClaim(urlQuery);
  if (error) return error;

  const referrerQuery = getParameterByName('referrer', requestUrl);
  const oEmbedData = generateOEmbedData(claim, referrerQuery);

  const formatQuery = getParameterByName('format', requestUrl);
  if (formatQuery === 'xml') {
    ctx.set('Content-Type', 'application/xml');
    const xmlData = generateXmlData(oEmbedData);

    return xmlData;
  }

  ctx.set('Content-Type', 'application/json');
  return oEmbedData;
}

module.exports = { getOEmbed };
