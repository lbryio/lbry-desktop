const { URL, LBRY_TV_STREAMING_API } = require('../../config');

const CONTINENT_COOKIE = 'continent';

function generateStreamUrl(claimName, claimId) {
  return `${LBRY_TV_STREAMING_API}/content/claims/${claimName}/${claimId}/stream`;
}

function generateEmbedUrl(claimName, claimId) {
  return `${URL}/$/embed/${claimName}/${claimId}`;
}

function generateDownloadUrl(claimName, claimId) {
  return `${URL}/$/download/${claimName}/${claimId}`;
}

function generateDirectUrl(claimName, claimId) {
  return `${URL}/$/stream/${claimName}/${claimId}`;
}

// module.exports needed since the web server imports this function
module.exports = { generateStreamUrl, generateEmbedUrl, generateDownloadUrl, generateDirectUrl, CONTINENT_COOKIE };
