const { Lbryio } = require('lbryinc/dist/bundle.es.js');
const { URL, LBRY_TV_STREAMING_API } = require('../../config');
const { getCookie, setCookie } = require('../../ui/util/saved-passwords');

const CONTINENT_COOKIE = 'continent';

function generateStreamUrl(claimName, claimId, apiUrl, streamingContinent) {
  let prefix = LBRY_TV_STREAMING_API || apiUrl;
  const continent = streamingContinent || getCookie(CONTINENT_COOKIE);

  if (continent && prefix.split('//').length > 1) {
    prefix = prefix.replace('//', '//' + continent + '.');
  } else {
    Lbryio.call('locale', 'get', {}, 'post').then(result => {
      const userContinent = getSupportedCDN(result.continent);
      setCookie(CONTINENT_COOKIE, userContinent, 1);
    });
  }

  return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
}

function getSupportedCDN(continent) {
  switch (continent) {
    case 'NA':
    case 'EU':
      return continent;
    default:
      return 'NA';
  }
}

function generateEmbedUrl(claimName, claimId) {
  return `${URL}/$/embed/${claimName}/${claimId}`;
}

function generateDownloadUrl(claimName, claimId) {
  return `/$/download/${claimName}/${claimId}`;
}

// module.exports needed since the web server imports this function
module.exports = { generateStreamUrl, generateEmbedUrl, generateDownloadUrl, CONTINENT_COOKIE };
