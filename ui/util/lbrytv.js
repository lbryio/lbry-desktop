const { Lbryio } = require('lbryinc');
const { URL, LBRY_TV_STREAMING_API } = require('../../config');

function generateStreamUrl(claimName, claimId, apiUrl) {
  let prefix = LBRY_TV_STREAMING_API || apiUrl;
  if (prefix.includes('localhost')) {
    return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
  }
  new Promise((resolve, reject) => {
    Lbryio.call('locale', 'get', {}, 'post').then(result => {
      if (prefix.split('//').length > 1) {
        prefix = prefix.replace('//', '//' + result.continent + '.');
      }
      resolve(prefix);
    });
  })
    .then(p => {
      console.log(`${p}/content/claims/${claimName}/${claimId}/stream`);
      return `${p}/content/claims/${claimName}/${claimId}/stream`;
    })
    .catch(err => {
      console.error(err.stack || err);
      return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
    });
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
