const { Lbryio } = require('lbryinc');
const { URL, LBRY_TV_STREAMING_API } = require('../../config');
const { getCookie, setCookie } = require('../../ui/util/saved-passwords');

const CONTINENT_COOKIE = 'continent';

function generateStreamUrl(claimName, claimId, apiUrl) {
  let prefix = LBRY_TV_STREAMING_API || apiUrl;
  const continent = getCookie(CONTINENT_COOKIE);

  if (continent && prefix.split('//').length > 1) {
    prefix = prefix.replace('//', '//' + continent + '.');
  } else {
    Lbryio.call('locale', 'get', {}, 'post').then(result => {
      const userContinent = result.continent;
      setCookie(CONTINENT_COOKIE, userContinent, 1);
    });
  }

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
