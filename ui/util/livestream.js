// @flow

/**
 * Helper to extract livestream claim uris from the output of
 * `selectActiveLivestreams`.
 *
 * @param activeLivestreams Object obtained from `selectActiveLivestreams`.
 * @param channelIds List of channel IDs to filter the results with.
 * @returns {[]|Array<*>}
 */
export function getLivestreamUris(activeLivestreams: ?LivestreamInfo, channelIds: ?Array<string>) {
  let values = (activeLivestreams && Object.values(activeLivestreams)) || [];

  if (channelIds && channelIds.length > 0) {
    // $FlowFixMe
    values = values.filter((v) => channelIds.includes(v.creatorId) && Boolean(v.latestClaimUri));
  } else {
    // $FlowFixMe
    values = values.filter((v) => Boolean(v.latestClaimUri));
  }

  // $FlowFixMe
  return values.map((v) => v.latestClaimUri);
}
