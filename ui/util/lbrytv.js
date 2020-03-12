const { Lbryio } = require('lbryinc');
const { URL, LBRY_TV_STREAMING_API } = require('../../config');

async function generateStreamUrl(claimName, claimId, apiUrl) {
  let prefix = LBRY_TV_STREAMING_API || apiUrl;
  try {
    let localeResponse = await Lbryio.call('locale', 'get', {}, 'post');
    if (prefix.split('//').length > 1) {
      prefix = prefix.replace('//', '//' + localeResponse.continent + '.');
    }
  } catch (err) {
    console.error(err.stack || err);
  }
  console.log(`${prefix}/content/claims/${claimName}/${claimId}/stream`);
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
