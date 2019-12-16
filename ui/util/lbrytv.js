const { URL } = require('../../config');

function generateStreamUrl(claimName, claimId, apiUrl) {
  const prefix = process.env.SDK_API_URL || apiUrl;
  return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
}

function generateEmbedUrl(claimName, claimId) {
  return `${URL}/embed/${claimName}/${claimId}`;
}

// module.exports needed since the web server imports this function
module.exports = { generateStreamUrl, generateEmbedUrl };
