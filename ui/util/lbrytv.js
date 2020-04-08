const { URL, LBRY_TV_STREAMING_API } = require('../../config');
const { getCookie } = require('../../ui/util/saved-passwords');

const CONTINENT_COOKIE = 'continent';

function generateStreamUrl(claimName, claimId, apiUrl, streamingContinent) {
  let prefix = LBRY_TV_STREAMING_API || apiUrl;
  const continent = streamingContinent || getCookie(CONTINENT_COOKIE);

  if (continent && prefix.split('//').length > 1) {
    prefix = prefix.replace('//', '//' + continent + '.');
  }

  return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
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
