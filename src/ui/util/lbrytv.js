function generateStreamUrl(claimName, claimId) {
  return `https://api.lbry.tv/content/claims/${claimName}/${claimId}/stream`;
}

module.exports.generateStreamUrl = generateStreamUrl;
