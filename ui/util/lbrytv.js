const { URL, LBRY_TV_STREAMING_API } = require('../../config');

function generateStreamUrl(claimName, claimId, apiUrl) {
  const prefix = LBRY_TV_STREAMING_API || apiUrl;
  return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
}

function generateEmbedUrl(claimName, claimId) {
  return `${URL}/$/embed/${claimName}/${claimId}`;
}

function generateDownloadUrl(claimName, claimId, apiUrl) {
  const streamUrl = generateStreamUrl(claimName, claimId, apiUrl);
  return `${streamUrl}?download=1`;
}

// module.exports needed since the web server imports this function
module.exports = { generateStreamUrl, generateEmbedUrl, generateDownloadUrl };
