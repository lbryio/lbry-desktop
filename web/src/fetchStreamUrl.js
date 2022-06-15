const Mime = require('mime-types');
const { PLAYER_SERVER } = require('../../config.js');
const { lbryProxy: Lbry } = require('../lbry');
const { buildURI } = require('./lbryURI');

async function fetchStreamUrl(claimName, claimId) {
  const uri = buildURI({ claimName, claimId });
  return await Lbry.get({ uri })
    .then(({ streaming_url }) => streaming_url)
    .catch((error) => {
      return '';
    });
}

/**
 * Direct URL to the content's bits without redirects.
 *
 * Move back to 'utils/web' when `fetchStreamUrl` is no longer needed.
 *
 * @param claim
 */
function generateContentUrl(claim) {
  const streamUrl = (claim) => {
    // Hardcoded version of fetchStreamUrl().
    return `${PLAYER_SERVER}/api/v3/streams/free/${claim.name}/${claim.claim_id}`;
  };

  const value = claim?.value;
  if (value?.source?.media_type && value?.source?.sd_hash) {
    const fileExt = `.${Mime.extension(value.source.media_type)}`;
    const sdHash = value.source.sd_hash.slice(0, 6);
    return `${streamUrl(claim)}/${sdHash}${fileExt}`;
  }

  return streamUrl(claim);
}

module.exports = {
  fetchStreamUrl,
  generateContentUrl,
};
