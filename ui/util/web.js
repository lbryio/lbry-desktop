const { URL, THUMBNAIL_CARDS_CDN_URL } = require('../../config');

const CONTINENT_COOKIE = 'continent';

function generateEmbedUrl(claimUri, startTime, referralLink, newestType, autoplay) {
  const uriPath = claimUri.replace('lbry://', '').replace(/#/g, ':');
  let urlParams = new URLSearchParams();

  if (startTime) {
    urlParams.append('t', escapeHtmlProperty(startTime));
  }

  if (referralLink) {
    urlParams.append('r', escapeHtmlProperty(referralLink));
  }

  if (autoplay) {
    urlParams.append('autoplay', true);
  }

  let embedUrl;
  if (newestType) {
    embedUrl = `${URL}/$/embed/${escapeHtmlProperty(uriPath)}?feature=${newestType}`;
  } else {
    embedUrl = `${URL}/$/embed/${escapeHtmlProperty(uriPath)}`;
  }
  const embedUrlParams = urlParams.toString() ? `?${urlParams.toString()}` : '';

  return `${embedUrl}${embedUrlParams}`;
}

function generateEmbedUrlEncoded(claimUri, startTime, referralLink) {
  const uriPath = claimUri.replace('lbry://', '').replace(/#/g, ':');
  const encodedUri = encodeURIComponent(uriPath).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');

  return generateEmbedUrl(encodedUri, startTime, referralLink).replace(/\$/g, '%24');
}

function generateEmbedIframeData(src) {
  const width = '560';
  const height = '315';
  const html = `<iframe id="odysee-iframe" width="${width}" height="${height}" src="${src}" allowfullscreen></iframe>`;

  return { html, width, height };
}

function generateDownloadUrl(claimName, claimId) {
  return `${URL}/$/download/${claimName}/${claimId}`;
}

function generateDirectUrl(claimName, claimId) {
  return `${URL}/$/stream/${claimName}/${claimId}`;
}

function generateNewestUrl(channelName, newestType) {
  return `${URL}/$/${newestType}/${channelName}`;
}

function getThumbnailCardCdnUrl(url) {
  if (
    !THUMBNAIL_CARDS_CDN_URL ||
    !url ||
    (url && (url.includes('https://twitter-card') || url.includes('https://cards.odycdn.com')))
  ) {
    return url;
  }

  if (url && !url.startsWith('data:image')) {
    return `${THUMBNAIL_CARDS_CDN_URL}${url}`;
  }
}

function getParameterByName(name, url) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
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

function unscapeHtmlProperty(property) {
  return property
    ? String(property)
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
    : '';
}

// module.exports needed since the web server imports this function
module.exports = {
  CONTINENT_COOKIE,
  generateDirectUrl,
  generateDownloadUrl,
  generateEmbedIframeData,
  generateEmbedUrl,
  generateEmbedUrlEncoded,
  getParameterByName,
  getThumbnailCardCdnUrl,
  escapeHtmlProperty,
  unscapeHtmlProperty,
  generateNewestUrl,
};
