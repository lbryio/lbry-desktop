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

module.exports = {
  fetchStreamUrl,
};
