// @flow

export function getChannelIdFromClaim(claim: ?Claim) {
  if (claim) {
    if (claim.value_type === 'channel') {
      return claim.claim_id;
    } else if (claim.signing_channel) {
      return claim.signing_channel.claim_id;
    }
  }
}
