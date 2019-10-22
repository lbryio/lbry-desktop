const { LBRY_TV_API } = require('../../../config');

function generateStreamUrl(claimName, claimId) {
  const prefix = process.env.SDK_API_URL || LBRY_TV_API;
  return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
}

module.exports = { generateStreamUrl };
