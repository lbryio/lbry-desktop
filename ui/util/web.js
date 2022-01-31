const { URL, LBRY_WEB_STREAMING_API, THUMBNAIL_CARDS_CDN_URL } = require('../../config');

const CONTINENT_COOKIE = 'continent';

function generateStreamUrl(claimName, claimId) {
  return `${LBRY_WEB_STREAMING_API}/content/claims/${encodeURIComponent(claimName)
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')}/${claimId}/stream`;
}

function generateEmbedUrl(claimName, claimId, startTime, referralLink) {
  let urlParams = new URLSearchParams();

  if (startTime) {
    urlParams.append('t', startTime);
  }

  if (referralLink) {
    urlParams.append('r', referralLink);
  }

  const encodedUriName = encodeURIComponent(claimName).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');

  const embedUrl = `${URL}/$/embed/${encodedUriName}/${claimId}`;
  const embedUrlParams = urlParams.toString() ? `?${urlParams.toString()}` : '';

  return `${embedUrl}${embedUrlParams}`;
}

function generateEmbedUrlEncoded(claimName, claimId, startTime, referralLink) {
  return generateEmbedUrl(claimName, claimId, startTime, referralLink).replace(/\$/g, '%24');
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

function getThumbnailCdnUrl(url) {
  if (
    !THUMBNAIL_CARDS_CDN_URL ||
    !url ||
    (url && (url.includes('https://twitter-card') || url.includes('https://cards.odysee.com')))
  ) {
    return url;
  }

  if (url && !url.startsWith('data:image')) {
    const encodedURL = Buffer.from(url).toString('base64');
    return `${THUMBNAIL_CARDS_CDN_URL}${encodedURL}.jpg`;
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

// module.exports needed since the web server imports this function
module.exports = {
  CONTINENT_COOKIE,
  generateDirectUrl,
  generateDownloadUrl,
  generateEmbedIframeData,
  generateEmbedUrl,
  generateEmbedUrlEncoded,
  generateStreamUrl,
  getParameterByName,
  getThumbnailCdnUrl,
  escapeHtmlProperty,
};
