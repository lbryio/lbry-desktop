const { URL, LBRY_WEB_STREAMING_API } = require('../../config');

const CONTINENT_COOKIE = 'continent';

function generateStreamUrl(claimName, claimId) {
  return `${LBRY_WEB_STREAMING_API}/content/claims/${encodeURIComponent(claimName)
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')}/${claimId}/stream`;
}

function generateEmbedUrl(claimName, claimId, includeStartTime, startTime, referralLink) {
  let urlParams = new URLSearchParams();
  if (includeStartTime && startTime) {
    urlParams.append('t', startTime);
  }

  if (referralLink) {
    urlParams.append('r', referralLink);
  }

  return `${URL}/$/embed/${encodeURIComponent(claimName)
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')}/${claimId}?${urlParams.toString()}`;
}

function generateDownloadUrl(claimName, claimId) {
  return `${URL}/$/download/${claimName}/${claimId}`;
}

function generateDirectUrl(claimName, claimId) {
  return `${URL}/$/stream/${claimName}/${claimId}`;
}

// module.exports needed since the web server imports this function
module.exports = { generateStreamUrl, generateEmbedUrl, generateDownloadUrl, generateDirectUrl, CONTINENT_COOKIE };
