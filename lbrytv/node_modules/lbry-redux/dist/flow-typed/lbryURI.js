// @flow
declare type LbryUrlObj = {
  // Path and channel will always exist when calling parseURI
  // But they may not exist when code calls buildURI
  isChannel?: boolean,
  path?: string,
  streamName?: string,
  streamClaimId?: string,
  channelName?: string,
  channelClaimId?: string,
  primaryClaimSequence?: number,
  secondaryClaimSequence?: number,
  primaryBidPosition?: number,
  secondaryBidPosition?: number,
  startTime?: number,

  // Below are considered deprecated and should not be used due to unreliableness with claim.canonical_url
  claimName?: string,
  claimId?: string,
  contentName?: string,
};
