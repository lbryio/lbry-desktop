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

export function getChannelFromClaim(claim: ?Claim) {
  return !claim
    ? null
    : claim.value_type === 'channel'
    ? claim
    : claim.signing_channel && claim.is_channel_signature_valid
    ? claim.signing_channel
    : null;
}
