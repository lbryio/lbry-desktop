function generateStreamUrl(claimName, claimId) {
  const prefix = process.env.SDK_API_URL;
  return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
}

module.exports = { generateStreamUrl };
