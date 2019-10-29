function generateStreamUrl(claimName, claimId, apiUrl) {
  const prefix = process.env.SDK_API_URL || apiUrl;
  return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
}

module.exports = { generateStreamUrl };
